const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Community = require('../models/Community');
const UserCommunity = require('../models/UserCommunity');
const { protect: auth } = require('../middleware/auth');

// Get posts from user's joined communities (feed)
router.get('/feed', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // Get user's joined communities
    const userCommunities = await UserCommunity.find({
      userId: req.user.id,
      isActive: true
    }).select('communityId');
    
    const communityIds = userCommunities.map(uc => uc.communityId);
    
    // Get posts from these communities
    const posts = await Post.find({
      community: { $in: communityIds },
      isActive: true
    })
    .populate('author', 'name role')
    .populate('community', 'name icon type')
    .populate('comments.user', 'name')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get posts from a specific community
router.get('/community/:communityId', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { communityId } = req.params;
    
    // Check if user is member of this community
    const membership = await UserCommunity.findOne({
      userId: req.user.id,
      communityId: communityId,
      isActive: true
    });
    
    if (!membership) {
      return res.status(403).json({ message: 'Not a member of this community' });
    }
    
    const posts = await Post.find({
      community: communityId,
      isActive: true
    })
    .populate('author', 'name role')
    .populate('community', 'name icon type')
    .populate('comments.user', 'name')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new post
router.post('/', auth, async (req, res) => {
  try {
    const { content, communityId, images = [] } = req.body;
    
    // Validate community membership
    const membership = await UserCommunity.findOne({
      userId: req.user.id,
      communityId: communityId,
      isActive: true
    });
    
    if (!membership) {
      return res.status(403).json({ message: 'Not a member of this community' });
    }
    
    const post = new Post({
      content,
      author: req.user.id,
      community: communityId,
      images
    });
    
    await post.save();
    
    // Populate the post before returning
    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name role')
      .populate('community', 'name icon type');
    
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Like/unlike a post
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    const existingLike = post.likes.find(like => 
      like.user.toString() === req.user.id
    );
    
    if (existingLike) {
      // Unlike
      post.likes = post.likes.filter(like => 
        like.user.toString() !== req.user.id
      );
    } else {
      // Like
      post.likes.push({ user: req.user.id });
    }
    
    await post.save();
    res.json({ liked: !existingLike, likesCount: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add comment to post
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    post.comments.push({
      user: req.user.id,
      content
    });
    
    await post.save();
    
    // Return the new comment with user info
    const updatedPost = await Post.findById(req.params.id)
      .populate('comments.user', 'name');
    
    const newComment = updatedPost.comments[updatedPost.comments.length - 1];
    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Share a post
router.post('/:id/share', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    const existingShare = post.shares.find(share => 
      share.user.toString() === req.user.id
    );
    
    if (!existingShare) {
      post.shares.push({ user: req.user.id });
      await post.save();
    }
    
    res.json({ shared: true, sharesCount: post.shares.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;