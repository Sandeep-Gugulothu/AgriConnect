const mongoose = require('mongoose');

const farmerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  landSize: {
    type: Number,
    required: true
  },
  soilType: {
    type: String,
    required: true,
    enum: ['clay', 'sandy', 'loamy', 'silt', 'mixed']
  },
  waterSource: {
    type: String,
    required: true,
    enum: ['bore', 'canal', 'river', 'rain', 'mixed']
  },
  location: {
    state: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    }
  },
  experience: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'expert']
  },
  budget: {
    type: Number,
    required: true
  },
  goals: {
    type: String,
    required: true,
    enum: ['subsistence', 'commercial', 'mixed']
  },
  previousCrops: {
    type: String,
    default: ''
  },
  profileScore: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FarmerProfile', farmerProfileSchema);