const express = require('express');
const router = express.Router();
const PracticeSession = require('../models/PracticeSession');
const PracticeRecord = require('../models/PracticeRecord');
const DrawingList = require('../models/DrawingList');
const authMiddleware = require('../middleware/auth');
const { parseSubjects } = require('./lists');

// Fisher-Yates array shuffle for unbiased random ordering
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Check if an object has ever been completed by this user prior to current moment
async function checkIfCompletedBefore(userId, objectName) {
  if (!objectName) return false;
  const normalized = objectName.trim().toLowerCase();
  const prior = await PracticeRecord.findOne({
    userId,
    normalizedName: normalized,
    status: 'completed'
  }).lean();
  return !!prior;
}

// GET /api/sessions/active - Retrieve current active session (for page refresh persistence)
router.get('/active', authMiddleware, async (req, res) => {
  try {
    const activeSession = await PracticeSession.findOne({
      userId: req.user.userId,
      isCompleted: false
    }).sort({ startedAt: -1 });

    if (!activeSession) {
      return res.json({ activeSession: null });
    }

    const isPrevCompleted = await checkIfCompletedBefore(req.user.userId, activeSession.currentObject);

    return res.json({
      activeSession: {
        id: activeSession._id,
        listId: activeSession.listId,
        listName: activeSession.listName,
        currentObject: activeSession.currentObject,
        initialCount: activeSession.initialCount,
        completedCount: activeSession.completedCount,
        skippedCount: activeSession.skippedCount,
        remainingCount: activeSession.remainingQueue.length,
        isCompleted: activeSession.isCompleted,
        isPreviouslyCompleted: isPrevCompleted,
        startedAt: activeSession.startedAt
      }
    });
  } catch (err) {
    console.error('Get active session error:', err);
    return res.status(500).json({ message: 'Error fetching active session', error: err.message });
  }
});

// POST /api/sessions/start - Start a new practice session
router.post('/start', authMiddleware, async (req, res) => {
  try {
    const { listId, customName, customSubjects } = req.body;
    let subjects = [];
    let listName = 'Quick Practice';
    let targetListId = null;

    if (listId) {
      if (typeof listId === 'string' && listId.startsWith('builtin:')) {
        const catId = listId.replace('builtin:', '');
        const { BUILT_IN_CATEGORIES, MASTER_LIBRARY_CATEGORY } = require('../data/builtInLists');
        const allBuiltIns = [MASTER_LIBRARY_CATEGORY, ...BUILT_IN_CATEGORIES];
        const matched = allBuiltIns.find(c => c.id === catId);
        if (!matched) {
          return res.status(404).json({ message: 'Selected built-in category not found' });
        }
        subjects = [...matched.subjects];
        listName = matched.name;
        targetListId = null;
      } else {
        const list = await DrawingList.findOne({ _id: listId, userId: req.user.userId });
        if (!list) {
          return res.status(404).json({ message: 'Selected drawing list not found' });
        }
        subjects = [...list.subjects];
        listName = list.name;
        targetListId = list._id;
      }
    } else if (customSubjects) {
      subjects = parseSubjects(customSubjects);
      if (customName && customName.trim()) {
        listName = customName.trim();
      }
    }

    if (!subjects || subjects.length === 0) {
      return res.status(400).json({ message: 'Cannot start session with an empty list of subjects.' });
    }

    // Cancel any older uncompleted sessions for this user so they don't dangle
    await PracticeSession.updateMany(
      { userId: req.user.userId, isCompleted: false },
      { $set: { isCompleted: true, completedAt: new Date() } }
    );

    // Randomize queue
    const shuffled = shuffleArray(subjects);
    const firstObject = shuffled[0];
    const remainingQueue = shuffled.slice(1);

    const newSession = new PracticeSession({
      userId: req.user.userId,
      listId: targetListId,
      listName,
      initialCount: shuffled.length,
      currentObject: firstObject,
      remainingQueue,
      completedCount: 0,
      skippedCount: 0,
      isCompleted: false,
      startedAt: new Date()
    });

    await newSession.save();

    const isPrevCompleted = await checkIfCompletedBefore(req.user.userId, firstObject);

    return res.status(201).json({
      message: 'Practice session started',
      session: {
        id: newSession._id,
        listId: newSession.listId,
        listName: newSession.listName,
        currentObject: newSession.currentObject,
        initialCount: newSession.initialCount,
        completedCount: 0,
        skippedCount: 0,
        remainingCount: newSession.remainingQueue.length,
        isCompleted: false,
        isPreviouslyCompleted: isPrevCompleted,
        startedAt: newSession.startedAt
      }
    });
  } catch (err) {
    console.error('Start session error:', err);
    return res.status(500).json({ message: 'Error starting practice session', error: err.message });
  }
});

// POST /api/sessions/:id/action - Record Completed or Skip action
router.post('/:id/action', authMiddleware, async (req, res) => {
  try {
    const { action, objectName } = req.body; // action: 'completed' | 'skip'

    if (!['completed', 'skip'].includes(action)) {
      return res.status(400).json({ message: "Action must be 'completed' or 'skip'." });
    }

    const session = await PracticeSession.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!session) {
      return res.status(404).json({ message: 'Practice session not found' });
    }

    if (session.isCompleted) {
      return res.status(400).json({ message: 'This session has already ended.' });
    }

    // Verify objectName matches current session active object to prevent duplicate clicks
    const currentObj = session.currentObject;
    if (!currentObj) {
      return res.status(400).json({ message: 'No active object in this session.' });
    }

    if (objectName && objectName.trim().toLowerCase() !== currentObj.trim().toLowerCase()) {
      // Mismatched submission (could be delayed click or replay)
      return res.status(409).json({
        message: 'This object has already been processed.',
        currentObject: currentObj
      });
    }

    const normalizedName = currentObj.trim().toLowerCase();

    // Prevent duplicate records for the same session and object
    const existingInSession = await PracticeRecord.findOne({
      sessionId: session._id,
      normalizedName
    });

    if (existingInSession) {
      return res.status(409).json({ message: 'Object already processed in this session.' });
    }

    const isCompletedAction = action === 'completed';
    const pointsEarned = isCompletedAction ? 1 : 0;

    // Create persistent practice record
    const record = new PracticeRecord({
      userId: req.user.userId,
      sessionId: session._id,
      listId: session.listId,
      listName: session.listName,
      objectName: currentObj,
      normalizedName,
      status: isCompletedAction ? 'completed' : 'skipped',
      points: pointsEarned,
      timestamp: new Date()
    });

    await record.save();

    // Update session counts
    if (isCompletedAction) {
      session.completedCount += 1;
    } else {
      session.skippedCount += 1;
    }

    let nextObject = null;
    let isPrevCompleted = false;
    let isSessionFinished = false;

    // Pick next object from remaining queue
    if (session.remainingQueue.length > 0) {
      nextObject = session.remainingQueue.shift();
      session.currentObject = nextObject;
      isPrevCompleted = await checkIfCompletedBefore(req.user.userId, nextObject);
    } else {
      // Session finished
      session.currentObject = null;
      session.isCompleted = true;
      session.completedAt = new Date();
      isSessionFinished = true;
    }

    await session.save();

    return res.json({
      message: isCompletedAction ? 'Drawing completed (+1 pt)' : 'Object skipped',
      action,
      processedObject: currentObj,
      pointsEarned,
      session: {
        id: session._id,
        listId: session.listId,
        listName: session.listName,
        currentObject: session.currentObject,
        initialCount: session.initialCount,
        completedCount: session.completedCount,
        skippedCount: session.skippedCount,
        remainingCount: session.remainingQueue.length,
        isCompleted: session.isCompleted,
        isPreviouslyCompleted: isPrevCompleted,
        startedAt: session.startedAt,
        completedAt: session.completedAt
      },
      isSessionFinished
    });
  } catch (err) {
    console.error('Session action error:', err);
    return res.status(500).json({ message: 'Error processing action', error: err.message });
  }
});

// POST /api/sessions/:id/cancel - End or discard active session
router.post('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const session = await PracticeSession.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!session) {
      return res.status(404).json({ message: 'Practice session not found' });
    }

    session.isCompleted = true;
    session.completedAt = new Date();
    await session.save();

    return res.json({ message: 'Practice session ended.', session });
  } catch (err) {
    return res.status(500).json({ message: 'Error ending session', error: err.message });
  }
});

module.exports = router;
