const express = require('express');
const router = express.Router();
const Community = require('../models/Community');
const UserCommunity = require('../models/UserCommunity');
const { protect: auth } = require('../middleware/auth');

// Simple route to get all communities (fallback)
router.get('/all', async (req, res) => {
  try {
    const communities = await Community.find({});
    
    // Calculate actual member counts
    const communitiesWithRealCounts = await Promise.all(
      communities.map(async (community) => {
        let actualMemberCount = 0;
        try {
          actualMemberCount = await UserCommunity.countDocuments({
            communityId: community._id
          });
        } catch (err) {
          // If UserCommunity fails, use stored count
          actualMemberCount = community.memberCount || 0;
        }
        
        return {
          ...community.toObject(),
          memberCount: actualMemberCount,
          isJoined: false
        };
      })
    );
    
    // Sort by actual member count
    communitiesWithRealCounts.sort((a, b) => b.memberCount - a.memberCount);
    
    res.json(communitiesWithRealCounts.slice(0, 50));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's joined communities - MUST be before /:id route
router.get('/my-communities', auth, async (req, res) => {
  try {
    const userCommunities = await UserCommunity.find({
      userId: req.user.id,
      isActive: true
    }).populate('communityId').sort({ joinedAt: -1 });
    
    const communities = userCommunities.map(uc => uc.communityId).filter(c => c !== null);
    res.json(communities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all communities with user's membership status
router.get('/', auth, async (req, res) => {
  try {
    const { type, search } = req.query;
    
    // Build query
    let query = {};
    if (type) query.type = type;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Get communities
    const communities = await Community.find(query);
    
    // Get user's memberships (with fallback if UserCommunity fails)
    let joinedCommunityIds = [];
    try {
      const userMemberships = await UserCommunity.find({
        userId: req.user.id
      }).select('communityId');
      joinedCommunityIds = userMemberships.map(m => m.communityId.toString());
    } catch (membershipError) {
      // Continue without membership data
    }
    
    // Add real member counts and membership status
    const communitiesWithStatus = await Promise.all(
      communities.map(async (community) => {
        let actualMemberCount = 0;
        try {
          actualMemberCount = await UserCommunity.countDocuments({
            communityId: community._id
          });
        } catch (err) {
          actualMemberCount = community.memberCount || 0;
        }
        
        return {
          ...community.toObject(),
          memberCount: actualMemberCount,
          isJoined: joinedCommunityIds.includes(community._id.toString())
        };
      })
    );
    
    // Sort by actual member count
    communitiesWithStatus.sort((a, b) => b.memberCount - a.memberCount);
    
    res.json(communitiesWithStatus.slice(0, 50));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Join a community
router.post('/:id/join', auth, async (req, res) => {
  try {
    const communityId = req.params.id;
    
    // Check if community exists
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }
    
    // Check if already joined
    const existingMembership = await UserCommunity.findOne({
      userId: req.user.id,
      communityId: communityId
    });
    
    if (existingMembership) {
      if (existingMembership.isActive) {
        return res.status(400).json({ message: 'Already joined this community' });
      } else {
        // Reactivate membership
        existingMembership.isActive = true;
        existingMembership.joinedAt = new Date();
        await existingMembership.save();
      }
    } else {
      // Create new membership
      await UserCommunity.create({
        userId: req.user.id,
        communityId: communityId
      });
    }
    
    // Update member count
    await Community.findByIdAndUpdate(communityId, {
      $inc: { memberCount: 1 }
    });
    
    res.json({ message: 'Successfully joined community' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Leave a community
router.post('/:id/leave', auth, async (req, res) => {
  try {
    const communityId = req.params.id;
    
    // Find and deactivate membership
    const membership = await UserCommunity.findOne({
      userId: req.user.id,
      communityId: communityId,
      isActive: true
    });
    
    if (!membership) {
      return res.status(404).json({ message: 'Not a member of this community' });
    }
    
    membership.isActive = false;
    await membership.save();
    
    // Update member count
    await Community.findByIdAndUpdate(communityId, {
      $inc: { memberCount: -1 }
    });
    
    res.json({ message: 'Successfully left community' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new community
router.post('/create', auth, async (req, res) => {
  try {
    const { name, description, type, category } = req.body;
    
    // Check if community name already exists
    const existingCommunity = await Community.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') }
    });
    
    if (existingCommunity) {
      return res.status(400).json({ message: 'Community with this name already exists' });
    }
    
    const community = new Community({
      name,
      description,
      type,
      category,
      icon: type, // Use type as icon for now
      memberCount: 1
    });
    
    await community.save();
    
    // Auto-join the creator
    await UserCommunity.create({
      userId: req.user.id,
      communityId: community._id,
      role: 'admin'
    });
    
    res.status(201).json(community);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get individual community by ID - MUST be after other specific routes
router.get('/:id', auth, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }
    
    // Calculate actual member count
    let actualMemberCount = 0;
    try {
      actualMemberCount = await UserCommunity.countDocuments({
        communityId: community._id
      });
    } catch (err) {
      actualMemberCount = community.memberCount || 0;
    }
    
    res.json({
      ...community.toObject(),
      memberCount: actualMemberCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Auto-join user to some default communities on first visit
router.post('/auto-join', auth, async (req, res) => {
  try {
    // Check if user has any communities
    const existingMemberships = await UserCommunity.find({
      userId: req.user.id,
      isActive: true
    });
    
    if (existingMemberships.length === 0) {
      // Get top 3 communities to auto-join
      const topCommunities = await Community.find({})
        .sort({ memberCount: -1 })
        .limit(3);
      
      // Auto-join these communities
      const memberships = topCommunities.map(community => ({
        userId: req.user.id,
        communityId: community._id
      }));
      
      await UserCommunity.insertMany(memberships);
      
      // Update member counts
      await Community.updateMany(
        { _id: { $in: topCommunities.map(c => c._id) } },
        { $inc: { memberCount: 1 } }
      );
      
      res.json({ message: `Auto-joined ${topCommunities.length} communities`, communities: topCommunities });
    } else {
      res.json({ message: 'User already has communities' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;