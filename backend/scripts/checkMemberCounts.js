const mongoose = require('mongoose');
const UserCommunity = require('../models/UserCommunity');
const Community = require('../models/Community');

const checkMemberCounts = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/agri-connect');
    console.log('Connected to MongoDB');

    console.log('=== UserCommunity Records ===');
    const userCommunities = await UserCommunity.find({});
    console.log('Total UserCommunity records:', userCommunities.length);
    
    console.log('\n=== Member Count by Community ===');
    const communities = await Community.find({});
    for (let community of communities) {
      const count = await UserCommunity.countDocuments({ communityId: community._id });
      console.log(`${community.name}: ${count} members`);
    }

    // Check if there are any communities with the old memberCount field
    console.log('\n=== Communities with memberCount field ===');
    const communitiesWithCount = await Community.find({ memberCount: { $exists: true } });
    console.log('Communities still having memberCount field:', communitiesWithCount.length);
    
    await mongoose.disconnect();
    console.log('\nCheck completed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkMemberCounts();