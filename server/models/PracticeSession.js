const mongoose = require('mongoose');

const practiceSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
    default: 'Quick Practice'
  },
  initialCount: {
    type: Number,
    required: true,
    default: 0
  },
  currentObject: {
    type: String,
    default: null
  },
  remainingQueue: {
    type: [String],
    default: []
  },
  completedCount: {
    type: Number,
    default: 0
  },
  skippedCount: {
    type: Number,
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false,
    index: true
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.PracticeSession || mongoose.model('PracticeSession', practiceSessionSchema);
