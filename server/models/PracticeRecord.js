const mongoose = require('mongoose');

const practiceRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PracticeSession',
    required: true,
    index: true
  },
  listId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DrawingList',
    default: null
  },
  listName: {
    type: String,
    required: true,
    default: 'Practice'
  },
  objectName: {
    type: String,
    required: true,
    trim: true
  },
  normalizedName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true
  },
  status: {
    type: String,
    enum: ['completed', 'skipped'],
    required: true,
    index: true
  },
  points: {
    type: Number,
    required: true,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Indexes for high performance aggregations and deduplication checks
practiceRecordSchema.index({ userId: 1, normalizedName: 1, status: 1 });
practiceRecordSchema.index({ userId: 1, timestamp: -1 });
practiceRecordSchema.index({ sessionId: 1, normalizedName: 1 });

module.exports = mongoose.models.PracticeRecord || mongoose.model('PracticeRecord', practiceRecordSchema);
