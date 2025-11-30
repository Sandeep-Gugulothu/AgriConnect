const mongoose = require('mongoose');
const User = require('../models/User');
const Community = require('../models/Community');
const Post = require('../models/Post');

const MONGODB_URI = 'mongodb://localhost:27017/agri-connect';

const samplePosts = [
  {
    content: "Just harvested my first batch of organic tomatoes this season! The yield is amazing - 15kg from just 10 plants. Anyone else trying organic methods?",
    communityName: "Tomato Farmers"
  },
  {
    content: "Looking for advice on pest control for rice crops. Noticed some brown spots on leaves. What's the best organic solution?",
    communityName: "Rice Farmers India"
  },
  {
    content: "Wheat prices are looking good this month. Sold my harvest at ₹2,200 per quintal. How are prices in your area?",
    communityName: "Wheat Growers Network"
  },
  {
    content: "Started using drip irrigation for my sugarcane field. Water usage reduced by 40% and yield increased by 20%! Highly recommend it.",
    communityName: "Sugarcane Farmers"
  },
  {
    content: "My potato crop is ready for harvest. This year I tried a new variety - Kufri Jyoti. Results are promising!",
    communityName: "Potato Growers"
  },
  {
    content: "Onion storage tips needed! Last year I lost 30% of my harvest due to improper storage. What methods work best?",
    communityName: "Onion Farmers"
  },
  {
    content: "Chili pepper harvest season is here! Red chilies are fetching good prices. Anyone interested in bulk orders?",
    communityName: "Chili Pepper Farmers"
  },
  {
    content: "My mango orchard is blooming beautifully this year. Expecting a bumper harvest. Alphonso variety is looking especially good!",
    communityName: "Fruit Growers"
  },
  {
    content: "Switched to organic farming 2 years ago. Initial investment was high but now getting premium prices. Worth the effort!",
    communityName: "Organic Farmers India"
  },
  {
    content: "My dairy cows are producing 25 liters per day on average. Using a balanced feed mix of green fodder and concentrates.",
    communityName: "Dairy Farmers Network"
  },
  {
    content: "Poultry farming update: My 500 broiler chickens are ready for market. Feed conversion ratio is excellent this batch!",
    communityName: "Poultry Farmers"
  },
  {
    content: "Installed IoT sensors in my greenhouse. Now I can monitor temperature, humidity, and soil moisture remotely. Technology is game-changing!",
    communityName: "Smart Farming Tech"
  },
  {
    content: "Punjab farmers - wheat sowing season is here. Weather conditions are perfect. Let's share our sowing schedules!",
    communityName: "Farmers of Punjab"
  },
  {
    content: "Sugarcane prices in UP are stable at ₹350 per quintal. Government support is helping small farmers like us.",
    communityName: "Farmers of Uttar Pradesh"
  },
  {
    content: "Maharashtra cotton farmers - this year's monsoon was good. Expecting better yields than last year. How's your crop looking?",
    communityName: "Farmers of Maharashtra"
  }
];

async function seedPosts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all users and communities
    const users = await User.find();
    const communities = await Community.find();

    if (users.length === 0) {
      console.log('No users found. Please register some users first.');
      return;
    }

    if (communities.length === 0) {
      console.log('No communities found. Please seed communities first.');
      return;
    }

    // Clear existing posts
    await Post.deleteMany({});
    console.log('Cleared existing posts');

    // Create posts
    const posts = [];
    
    for (const samplePost of samplePosts) {
      const community = communities.find(c => c.name === samplePost.communityName);
      if (community) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        
        const post = new Post({
          content: samplePost.content,
          author: randomUser._id,
          community: community._id,
          likes: [],
          comments: [],
          shares: [],
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random time within last 7 days
        });
        
        posts.push(post);
      }
    }

    await Post.insertMany(posts);
    console.log(`Created ${posts.length} sample posts`);

    // Add some additional random posts
    const additionalPosts = [];
    const randomContents = [
      "Weather forecast looks good for the next week. Perfect for harvesting!",
      "Anyone tried the new fertilizer brand? Looking for reviews before purchasing.",
      "Local market prices are fluctuating. Keeping a close watch on trends.",
      "Sharing my experience with crop rotation. It really helps soil health!",
      "Government subsidy applications are open. Don't miss the deadline!",
      "Pest attack in my field. Need urgent advice from experienced farmers.",
      "Celebrating a successful harvest season! Thank you all for the support.",
      "New farming technique I learned from YouTube. Results are promising!",
      "Water scarcity is a real issue this year. How are you managing irrigation?",
      "Organic certification process completed. Now targeting premium markets!"
    ];

    for (let i = 0; i < 20; i++) {
      const randomCommunity = communities[Math.floor(Math.random() * communities.length)];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomContent = randomContents[Math.floor(Math.random() * randomContents.length)];
      
      const post = new Post({
        content: randomContent,
        author: randomUser._id,
        community: randomCommunity._id,
        likes: [],
        comments: [],
        shares: [],
        createdAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000) // Random time within last 14 days
      });
      
      additionalPosts.push(post);
    }

    await Post.insertMany(additionalPosts);
    console.log(`Created ${additionalPosts.length} additional random posts`);
    console.log(`Total posts created: ${posts.length + additionalPosts.length}`);

  } catch (error) {
    console.error('Error seeding posts:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedPosts();