const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Community = require('../models/Community');
const UserCommunity = require('../models/UserCommunity');

// Get database overview
router.get('/overview', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const communityCount = await Community.countDocuments();
    const membershipCount = await UserCommunity.countDocuments();
    
    const users = await User.find({}).select('name email role location').limit(20);
    const communities = await Community.find({}).select('name type memberCount').limit(20);
    
    // Get community memberships with user and community names
    const memberships = await UserCommunity.find({})
      .populate('userId', 'name email')
      .populate('communityId', 'name type')
      .limit(50);
    
    res.json({
      stats: {
        totalUsers: userCount,
        totalCommunities: communityCount,
        totalMemberships: membershipCount
      },
      users,
      communities,
      memberships
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;