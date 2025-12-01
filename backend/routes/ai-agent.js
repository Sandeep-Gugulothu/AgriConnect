const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const FarmerProfile = require('../models/FarmerProfile');
const Crop = require('../models/Crop');
const { getHybridResponse } = require('../services/hybridAI');



// Chat endpoint with hybrid AI
router.post('/chat', protect, async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Get farmer profile and crops for context
    const farmerProfile = await FarmerProfile.findOne({ userId: req.user.id });
    const userCrops = await Crop.find({ userId: req.user.id }).limit(5);
    
    // Get hybrid AI response
    const result = await getHybridResponse(message, farmerProfile, userCrops);
    
    res.json({
      response: result.response,
      source: result.source,
      processingTime: result.processingTime
    });
  } catch (error) {
    console.error('Error in AI chat:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;