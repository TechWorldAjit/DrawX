const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const PracticeRecord = require('../models/PracticeRecord');
const authMiddleware = require('../middleware/auth');

// GET /api/history - Searchable, filterable practice records
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { search, status, listId, dateRange, page = 1, limit = 25 } = req.query;
    const userObjectId = new mongoose.Types.ObjectId(req.user.userId);

    const query = { userId: userObjectId };

    // Search by object name
    if (search && search.trim()) {
      query.objectName = { $regex: search.trim(), $options: 'i' };
    }

    // Status filter ('completed', 'skipped')
    if (status && status !== 'all') {
      query.status = status;
    }

    // List filter
    if (listId && listId !== 'all') {
      query.listId = new mongoose.Types.ObjectId(listId);
    }

    // Date range filter
    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      if (dateRange === 'today') {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        query.timestamp = { $gte: startOfDay };
      } else if (dateRange === '7days') {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        query.timestamp = { $gte: sevenDaysAgo };
      } else if (dateRange === '30days') {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        query.timestamp = { $gte: thirtyDaysAgo };
      }
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 25;
    const skip = (pageNum - 1) * limitNum;

    const totalRecords = await PracticeRecord.countDocuments(query);
    const records = await PracticeRecord.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    // To determine if an object in the records was previously completed before that record's timestamp:
    // Gather all normalizedNames in current batch
    const normalizedNames = [...new Set(records.map(r => r.normalizedName))];

    // For these normalized names, get their earliest completed timestamp
    const earliestCompletions = await PracticeRecord.aggregate([
      {
        $match: {
          userId: userObjectId,
          status: 'completed',
          normalizedName: { $in: normalizedNames }
        }
      },
      {
        $group: {
          _id: '$normalizedName',
          firstCompletedAt: { $min: '$timestamp' },
          totalCompletedCount: { $sum: 1 }
        }
      }
    ]);

    const earliestMap = {};
    for (const ec of earliestCompletions) {
      earliestMap[ec._id] = {
        firstCompletedAt: ec.firstCompletedAt,
        totalCompletedCount: ec.totalCompletedCount
      };
    }

    const formattedRecords = records.map(r => {
      const ec = earliestMap[r.normalizedName];
      // Object was completed prior if there exists a completion timestamp earlier than this record's timestamp
      const wasCompletedBefore = ec && new Date(ec.firstCompletedAt) < new Date(r.timestamp);

      return {
        id: r._id,
        sessionId: r.sessionId,
        objectName: r.objectName,
        normalizedName: r.normalizedName,
        status: r.status,
        points: r.points,
        listName: r.listName,
        timestamp: r.timestamp,
        wasCompletedBefore: !!wasCompletedBefore
      };
    });

    return res.json({
      records: formattedRecords,
      pagination: {
        total: totalRecords,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalRecords / limitNum) || 1
      }
    });
  } catch (err) {
    console.error('History query error:', err);
    return res.status(500).json({ message: 'Error fetching history', error: err.message });
  }
});

// GET /api/history/unique-completed - All distinct completed objects
router.get('/unique-completed', authMiddleware, async (req, res) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.user.userId);
    const { search } = req.query;

    const pipeline = [
      {
        $match: {
          userId: userObjectId,
          status: 'completed'
        }
      }
    ];

    if (search && search.trim()) {
      pipeline.push({
        $match: {
          objectName: { $regex: search.trim(), $options: 'i' }
        }
      });
    }

    pipeline.push(
      {
        $group: {
          _id: '$normalizedName',
          displayName: { $first: '$objectName' },
          timesCompleted: { $sum: 1 },
          firstCompletedAt: { $min: '$timestamp' },
          latestCompletedAt: { $max: '$timestamp' }
        }
      },
      {
        $sort: { timesCompleted: -1, latestCompletedAt: -1 }
      }
    );

    const results = await PracticeRecord.aggregate(pipeline);

    const formatted = results.map(item => ({
      normalizedName: item._id,
      objectName: item.displayName,
      timesCompleted: item.timesCompleted,
      firstCompletedAt: item.firstCompletedAt,
      latestCompletedAt: item.latestCompletedAt
    }));

    return res.json({
      uniqueObjects: formatted,
      totalCount: formatted.length
    });
  } catch (err) {
    console.error('Unique completed query error:', err);
    return res.status(500).json({ message: 'Error fetching unique completed objects', error: err.message });
  }
});

module.exports = router;
