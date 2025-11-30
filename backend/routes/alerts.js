const express = require('express');
const router = express.Router();
const { protect: auth } = require('../middleware/auth');

// Mock alerts data
const mockAlerts = [
  { 
    type: 'weather', 
    title: 'Heavy Rain Alert', 
    description: 'Expected in next 48 hours', 
    severity: 'high',
    createdAt: new Date()
  },
  { 
    type: 'pest', 
    title: 'Pest Warning', 
    description: 'Aphids spotted in nearby farms', 
    severity: 'medium',
    createdAt: new Date()
  },
  { 
    type: 'market', 
    title: 'Price Alert', 
    description: 'Wheat prices increased by 8%', 
    severity: 'low',
    createdAt: new Date()
  }
];

// Get user alerts
router.get('/', auth, async (req, res) => {
  try {
    res.json(mockAlerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new alert
router.post('/', auth, async (req, res) => {
  try {
    const { type, title, description, severity = 'medium' } = req.body;
    
    const newAlert = {
      type,
      title,
      description,
      severity,
      createdAt: new Date()
    };
    
    mockAlerts.unshift(newAlert);
    res.status(201).json(newAlert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;