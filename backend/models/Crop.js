const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cropName: {
    type: String,
    required: true
  },
  variety: {
    type: String,
    default: ''
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
  plantingDate: {
    type: Date
  },
  expectedHarvest: {
    type: Date
  },
  status: {
    type: String,
    enum: ['planning', 'planted', 'growing', 'harvested'],
    default: 'planning'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Crop', cropSchema);