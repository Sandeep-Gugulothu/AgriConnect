const express = require('express');
const router = express.Router();
const { protect: auth } = require('../middleware/auth');

// Mock market data
const mockMarketData = [
  { commodity: 'Wheat', change: '+8%', description: 'Up 8% this week due to export demand', price: 2500 },
  { commodity: 'Rice', change: '+3%', description: 'Steady demand from domestic market', price: 3200 },
  { commodity: 'Tomato', change: '+15%', description: 'Prices expected to increase by 15%', price: 45 },
  { commodity: 'Onion', change: '-5%', description: 'Good harvest leading to price drop', price: 25 },
  { commodity: 'Subsidy Alert', change: 'New', description: '₹50,000 for drip irrigation systems', price: null }
];

// Get market prices
router.get('/prices', auth, async (req, res) => {
  try {
    res.json(mockMarketData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;