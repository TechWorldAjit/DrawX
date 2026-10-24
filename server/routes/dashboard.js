const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const PracticeRecord = require('../models/PracticeRecord');
const PracticeSession = require('../models/PracticeSession');
const authMiddleware = require('../middleware/auth');

// GET /api/dashboard/stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.user.userId);

    // 1. Total Completed & Skipped counts and Total Points
    const recordCountsPromise = PracticeRecord.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          points: { $sum: '$points' }
        }
      }
    ]);

    // 2. Total Unique Objects Completed (distinct normalizedName with status: 'completed')
    const uniqueCompletedPromise = PracticeRecord.aggregate([
      { $match: { userId: userObjectId, status: 'completed' } },
      { $group: { _id: '$normalizedName' } },
      { $count: 'uniqueCount' }
    ]);

    // 3. Total Practice Sessions
    const totalSessionsPromise = PracticeSession.countDocuments({ userId: userObjectId });

    // 4. Daily Drawing Activity (last 14 days)
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13);
    fourteenDaysAgo.setHours(0, 0, 0, 0);

    const dailyActivityPromise = PracticeRecord.aggregate([
      {
        $match: {
          userId: userObjectId,
          timestamp: { $gte: fourteenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            dateStr: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            status: '$status'
          },
          count: { $sum: 1 }
        }
      }
    ]);

    // 5. Recent Activity (last 10 records)
    const recentActivityPromise = PracticeRecord.find({ userId: userObjectId })
      .sort({ timestamp: -1 })
      .limit(10)
      .lean();

    // 6. Current active session (if any)
    const activeSessionPromise = PracticeSession.findOne({
      userId: userObjectId,
      isCompleted: false
    }).sort({ startedAt: -1 }).lean();

    const [
      recordCounts,
      uniqueResult,
      totalSessions,
      dailyResults,
      recentRecords,
      activeSession
    ] = await Promise.all([
      recordCountsPromise,
      uniqueCompletedPromise,
      totalSessionsPromise,
      dailyActivityPromise,
      recentActivityPromise,
      activeSessionPromise
    ]);

    let totalCompleted = 0;
    let totalSkipped = 0;
    let totalPoints = 0;

    for (const item of recordCounts) {
      if (item._id === 'completed') {
        totalCompleted = item.count;
        totalPoints = item.points || item.count;
      } else if (item._id === 'skipped') {
        totalSkipped = item.count;
      }
    }

    const totalUniqueCompleted = (uniqueResult && uniqueResult[0]) ? uniqueResult[0].uniqueCount : 0;
    const totalProcessed = totalCompleted + totalSkipped;
    const completionRate = totalProcessed > 0 ? Math.round((totalCompleted / totalProcessed) * 100) : 0;

    // Build day-by-day continuous array for last 14 days
    const dailyMap = {};
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      const key = d.toISOString().split('T')[0];
      const displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailyMap[key] = { date: key, label: displayDate, completed: 0, skipped: 0, total: 0 };
    }

    for (const r of dailyResults) {
      const dateKey = r._id.dateStr;
      if (dailyMap[dateKey]) {
        if (r._id.status === 'completed') {
          dailyMap[dateKey].completed = r.count;
        } else if (r._id.status === 'skipped') {
          dailyMap[dateKey].skipped = r.count;
        }
        dailyMap[dateKey].total = dailyMap[dateKey].completed + dailyMap[dateKey].skipped;
      }
    }

    const dailyChartData = Object.values(dailyMap);

    const pieData = [
      { name: 'Completed', value: totalCompleted, color: '#10B981' },
      { name: 'Skipped', value: totalSkipped, color: '#64748B' }
    ];

    return res.json({
      stats: {
        totalCompleted,
        totalSkipped,
        totalUniqueCompleted,
        totalPoints,
        totalSessions,
        completionRate,
        pieData,
        dailyChartData,
        recentActivity: recentRecords.map(r => ({
          id: r._id,
          objectName: r.objectName,
          status: r.status,
          listName: r.listName,
          points: r.points,
          timestamp: r.timestamp
        })),
        activeSession: activeSession ? {
          id: activeSession._id,
          listName: activeSession.listName,
          currentObject: activeSession.currentObject,
          initialCount: activeSession.initialCount,
          completedCount: activeSession.completedCount,
          skippedCount: activeSession.skippedCount,
          remainingCount: activeSession.remainingQueue.length,
          startedAt: activeSession.startedAt
        } : null
      }
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    return res.status(500).json({ message: 'Error loading dashboard statistics', error: err.message });
  }
});

module.exports = router;
