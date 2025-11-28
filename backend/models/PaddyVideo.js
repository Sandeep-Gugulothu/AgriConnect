const mongoose = require('mongoose');

const paddyVideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true // e.g., "1:30"
  },
  videoUrl: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    default: '🌾'
  },
  category: {
    type: String,
    enum: ['planting', 'water', 'care', 'harvest'],
    required: true
  },
  stage: {
    type: String,
    enum: ['nursery', 'transplanting', 'growing', 'flowering', 'harvest'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  },
  tips: [String],
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

paddyVideoSchema.index({ category: 1, stage: 1, order: 1 });

module.exports = mongoose.model('PaddyVideo', paddyVideoSchema);