const mongoose = require('mongoose');

const drawingListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  subjects: {
    type: [String],
    required: true,
    validate: {
      validator: (arr) => Array.isArray(arr) && arr.length > 0,
      message: 'List must contain at least one drawing subject'
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.DrawingList || mongoose.model('DrawingList', drawingListSchema);
