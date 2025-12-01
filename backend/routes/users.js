const express = require('express');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Post = require('../models/Post');
const UserCommunity = require('../models/UserCommunity');
const Community = require('../models/Community');

const router = express.Router();

router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/profile/posts', protect, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .populate('community', 'name')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/profile/communities', protect, async (req, res) => {
  try {
    const userCommunities = await UserCommunity.find({ userId: req.user._id, isActive: true })
      .populate('communityId', 'name description memberCount')
      .sort({ joinedAt: -1 });
    res.json(userCommunities);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/profile/crops', protect, async (req, res) => {
  try {
    const Crop = require('../models/Crop');
    const crops = await Crop.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(crops);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;