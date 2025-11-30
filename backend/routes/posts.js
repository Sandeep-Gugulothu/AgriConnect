const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Post = require('../models/Post');
const Community = require('../models/Community');
const UserCommunity = require('../models/UserCommunity');
const { protect: auth } = require('../middleware/auth');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

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
      community: { $in: communityIds }
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
    
    const posts = await Post.find({
      community: communityId
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
router.post('/', auth, upload.array('images', 4), async (req, res) => {
  try {
    const { content, communityId } = req.body;
    
    // Validate community membership
    const membership = await UserCommunity.findOne({
      userId: req.user.id,
      communityId: communityId,
      isActive: true
    });
    
    if (!membership) {
      return res.status(403).json({ message: 'Not a member of this community' });
    }
    
    // Process uploaded images
    const imageUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    
    const post = new Post({
      content,
      author: req.user.id,
      community: communityId,
      images: imageUrls
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

// Delete a post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }
    
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;