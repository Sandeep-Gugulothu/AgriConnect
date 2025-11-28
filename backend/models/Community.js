const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['location', 'crop', 'interest'],
    required: true
  },
  category: {
    type: String,
    required: true // e.g., 'rice', 'wheat', 'village', 'district'
  },
  icon: {
    type: String,
    default: '🌾'
  },
  memberCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // For location-based communities
  locationData: {
    country: String,
    state: String,
    district: String,
    mandal: String,
    village: String,
    level: String // 'village', 'mandal', 'district', 'state', 'country'
  },
  // For crop-based communities
  cropData: {
    cropName: String,
    season: String, // 'kharif', 'rabi', 'zaid', 'perennial'
    category: String // 'cereal', 'vegetable', 'fruit', 'cash_crop'
  }
}, {
  timestamps: true
});

// Index for efficient queries
communitySchema.index({ type: 1, category: 1 });
communitySchema.index({ 'locationData.state': 1, 'locationData.district': 1 });
communitySchema.index({ memberCount: -1 });

module.exports = mongoose.model('Community', communitySchema);