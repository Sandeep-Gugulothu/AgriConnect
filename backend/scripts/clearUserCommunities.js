const mongoose = require('mongoose');
const UserCommunity = require('../models/UserCommunity');

const clearUserCommunities = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/agri-connect');
    console.log('Connected to MongoDB');

    // Remove all UserCommunity records to start fresh
    const result = await UserCommunity.deleteMany({});
    console.log(`Deleted ${result.deletedCount} UserCommunity records`);
    
    await mongoose.disconnect();
    console.log('UserCommunity collection cleared');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

clearUserCommunities();