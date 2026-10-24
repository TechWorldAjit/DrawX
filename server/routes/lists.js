const express = require('express');
const router = express.Router();
const DrawingList = require('../models/DrawingList');
const authMiddleware = require('../middleware/auth');

// Utility to parse comma-separated string or array into trimmed, deduplicated subjects
function parseSubjects(input) {
  let rawItems = [];
  if (Array.isArray(input)) {
    rawItems = input;
  } else if (typeof input === 'string') {
    rawItems = input.split(/,|\n/);
  }

  const seen = new Set();
  const validSubjects = [];

  for (const item of rawItems) {
    if (!item) continue;
    const trimmed = item.trim();
    if (!trimmed) continue;
    const lower = trimmed.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      validSubjects.push(trimmed);
    }
  }

  return validSubjects;
}

// GET /api/lists - Get all lists for current user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const lists = await DrawingList.find({ userId: req.user.userId }).sort({ updatedAt: -1 });
    return res.json({ lists });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching drawing lists', error: err.message });
  }
});

// GET /api/lists/:id - Get single list
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const list = await DrawingList.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!list) {
      return res.status(404).json({ message: 'Drawing list not found' });
    }
    return res.json({ list });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching list', error: err.message });
  }
});

// POST /api/lists - Create a new list
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, rawSubjects, subjects } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'List name is required.' });
    }

    const parsed = parseSubjects(rawSubjects || subjects);
    if (parsed.length === 0) {
      return res.status(400).json({ message: 'List must contain at least one valid object prompt.' });
    }

    const newList = new DrawingList({
      userId: req.user.userId,
      name: name.trim(),
      subjects: parsed
    });

    await newList.save();
    return res.status(201).json({
      message: 'Drawing list created successfully',
      list: newList,
      validCount: parsed.length
    });
  } catch (err) {
    console.error('Create list error:', err);
    return res.status(500).json({ message: 'Error creating drawing list', error: err.message });
  }
});

// PUT /api/lists/:id - Update / Replace list
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, rawSubjects, subjects } = req.body;

    const list = await DrawingList.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!list) {
      return res.status(404).json({ message: 'Drawing list not found' });
    }

    if (name && name.trim()) {
      list.name = name.trim();
    }

    if (rawSubjects !== undefined || subjects !== undefined) {
      const parsed = parseSubjects(rawSubjects !== undefined ? rawSubjects : subjects);
      if (parsed.length === 0) {
        return res.status(400).json({ message: 'List must contain at least one valid object prompt.' });
      }
      list.subjects = parsed;
    }

    await list.save();
    return res.json({
      message: 'Drawing list updated successfully',
      list,
      validCount: list.subjects.length
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error updating drawing list', error: err.message });
  }
});

// DELETE /api/lists/:id - Delete list (historical practice records remain intact)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const list = await DrawingList.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!list) {
      return res.status(404).json({ message: 'Drawing list not found' });
    }

    return res.json({
      message: 'Drawing list deleted successfully. Historical records have been preserved.'
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error deleting list', error: err.message });
  }
});

// POST /api/lists/seed-preset - Add a preset category to user's lists
router.post('/seed-preset', authMiddleware, async (req, res) => {
  try {
    const { presetKey } = req.body;
    const presets = {
      'daily': {
        name: 'Daily Objects',
        subjects: ['Water bottle', 'Keychain', 'Wall clock', 'Coffee mug', 'Backpack', 'Sunglasses', 'Desk lamp', 'Umbrella', 'Shoes', 'Headphones', 'Toothbrush', 'Wallet']
      },
      'stationery': {
        name: 'Stationery',
        subjects: ['Pencil', 'Eraser', 'Scissors', 'Stapler', 'Paperclip', 'Sharpener', 'Fountain pen', 'Ruler', 'Sticky notes', 'Highlighter', 'Compass', 'Paintbrush']
      },
      'animals': {
        name: 'Animals',
        subjects: ['Dog', 'Cat', 'Elephant', 'Horse', 'Sparrow', 'Chameleon', 'Lion', 'Rabbit', 'Owl', 'Dolphin', 'Sea turtle', 'Wolf']
      },
      'human_figures': {
        name: 'Human Figures & Poses',
        subjects: ['Standing upright figure', 'Running pose', 'Seated on chair', 'Hand holding a pencil', 'Walking human figure', 'Portrait side profile', 'Jumping pose', 'Stretching pose', 'Thinking posture', 'Resting head on hands']
      },
      'technical': {
        name: 'Technical Objects',
        subjects: ['Mechanical gear', 'Bicycle pedal', 'Computer mouse', 'Digital camera lens', 'Microphone', 'Electric drill', 'Car engine piston', 'Drone propeller', 'Screwdriver set', 'Audio mixer knob']
      }
    };

    const preset = presets[presetKey];
    if (!preset) {
      return res.status(400).json({ message: 'Unknown preset category.' });
    }

    const newList = new DrawingList({
      userId: req.user.userId,
      name: preset.name,
      subjects: preset.subjects
    });

    await newList.save();
    return res.status(201).json({ message: `Preset '${preset.name}' added successfully`, list: newList });
  } catch (err) {
    return res.status(500).json({ message: 'Error adding preset list', error: err.message });
  }
});

module.exports = router;
module.exports.parseSubjects = parseSubjects;
