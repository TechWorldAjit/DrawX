const express = require('express');
const router = express.Router();
const User = require('../models/User');
const PracticeRecord = require('../models/PracticeRecord');
const authMiddleware = require('../middleware/auth');

// GET /api/leaderboard - Public leaderboard for opted-in users
router.get('/', authMiddleware, async (req, res) => {
  try {
    // 1. Find all users who have opted into the public leaderboard
    const optedInUsers = await User.find({ leaderboardOptIn: { $ne: false } })
      .select('_id username createdAt')
      .lean();

    const userIds = optedInUsers.map(u => u._id);

    // 2. Aggregate stats for these users from PracticeRecord
    const statsAggregation = await PracticeRecord.aggregate([
      {
        $match: {
          userId: { $in: userIds },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: {
            userId: '$userId',
            normalizedName: '$normalizedName'
          },
          completions: { $sum: 1 },
          points: { $sum: '$points' }
        }
      },
      {
        $group: {
          _id: '$_id.userId',
          totalDrawingsCompleted: { $sum: '$completions' },
          totalPoints: { $sum: '$points' },
          uniqueObjectsCompleted: { $sum: 1 }
        }
      }
    ]);

    const statsMap = {};
    for (const stat of statsAggregation) {
      statsMap[stat._id.toString()] = {
        totalDrawingsCompleted: stat.totalDrawingsCompleted,
        totalPoints: stat.totalPoints,
        uniqueObjectsCompleted: stat.uniqueObjectsCompleted
      };
    }

    // Combine user records
    const leaderboard = optedInUsers.map(u => {
      const uStats = statsMap[u._id.toString()] || {
        totalDrawingsCompleted: 0,
        totalPoints: 0,
        uniqueObjectsCompleted: 0
      };

      return {
        userId: u._id,
        username: u.username,
        createdAt: u.createdAt,
        totalPoints: uStats.totalPoints,
        totalDrawingsCompleted: uStats.totalDrawingsCompleted,
        uniqueObjectsCompleted: uStats.uniqueObjectsCompleted,
        isCurrentUser: u._id.toString() === req.user.userId
      };
    });

    // Sort: Total Points DESC, Unique Objects Completed DESC, CreatedAt ASC
    leaderboard.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }
      if (b.uniqueObjectsCompleted !== a.uniqueObjectsCompleted) {
        return b.uniqueObjectsCompleted - a.uniqueObjectsCompleted;
      }
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    // Assign rank
    const rankedLeaderboard = leaderboard.map((entry, idx) => ({
      rank: idx + 1,
      userId: entry.userId,
      username: entry.username,
      totalPoints: entry.totalPoints,
      totalDrawingsCompleted: entry.totalDrawingsCompleted,
      uniqueObjectsCompleted: entry.uniqueObjectsCompleted,
      isCurrentUser: entry.isCurrentUser
    }));

    // Find current user's rank
    const currentUserEntry = rankedLeaderboard.find(e => e.isCurrentUser) || null;

    return res.json({
      leaderboard: rankedLeaderboard,
      currentUserRank: currentUserEntry ? currentUserEntry.rank : null,
      currentUserStats: currentUserEntry
    });
  } catch (err) {
    console.error('Leaderboard error:', err);
    return res.status(500).json({ message: 'Error fetching leaderboard', error: err.message });
  }
});

module.exports = router;
