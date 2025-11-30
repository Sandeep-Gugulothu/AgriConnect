const express = require('express');
const router = express.Router();
const { protect: auth } = require('../middleware/auth');

// Mock crops data - in production, this would come from database
const mockCrops = [
  { name: 'Wheat', status: 'Growing', area: 2, days: 45 },
  { name: 'Tomatoes', status: 'Planning', area: 1, days: 0 },
  { name: 'Rice', status: 'Growing', area: 3, days: 30 }
];

// Get user's crops
router.get('/', auth, async (req, res) => {
  try {
    // Return mock data for now
    res.json(mockCrops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new crop
router.post('/', auth, async (req, res) => {
  try {
    const { name, area, status = 'Planning' } = req.body;
    
    const newCrop = {
      name,
      status,
      area,
      days: status === 'Growing' ? 1 : 0
    };
    
    mockCrops.push(newCrop);
    res.status(201).json(newCrop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;