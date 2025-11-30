const mongoose = require('mongoose');
const Community = require('../models/Community');

const cleanDatabase = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/agri-connect');
    console.log('Connected to MongoDB');

    // Remove the memberCount field from all communities
    const result = await Community.updateMany(
      {},
      { $unset: { memberCount: "" } }
    );

    console.log(`Updated ${result.modifiedCount} communities - removed memberCount field`);
    
    // List all communities to verify
    const communities = await Community.find({}).select('name type');
    console.log('\nCommunities in database:');
    communities.forEach(community => {
      console.log(`- ${community.name} (${community.type})`);
    });

    await mongoose.disconnect();
    console.log('\nDatabase cleanup completed');
  } catch (error) {
    console.error('Error cleaning database:', error);
    process.exit(1);
  }
};

cleanDatabase();