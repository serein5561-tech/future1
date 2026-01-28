const mongoose = require('mongoose');

const transformationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  originalImageUrl: {
    type: String,
    required: true,
  },
  transformedImageUrl: {
    type: String,
    required: true,
  },
  career: {
    type: String,
    required: true,
  },
  prompt: {
    type: String,
    default: '',
  },
  aiModel: {
    type: String,
    default: 'replicate',
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Transformation', transformationSchema);
