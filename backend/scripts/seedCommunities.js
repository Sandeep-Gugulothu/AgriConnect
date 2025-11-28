const mongoose = require('mongoose');
const Community = require('../models/Community');

const seedCommunities = async () => {
  try {
    // Clear existing communities
    await Community.deleteMany({});
    
    // Crop-based communities (Most popular in India)
    const cropCommunities = [
      {
        name: 'Rice Farmers India',
        description: 'Connect with rice farmers across India. Share techniques, market prices, and seasonal advice.',
        type: 'crop',
        category: 'rice',
        icon: 'crop',
        memberCount: 45000,
        cropData: {
          cropName: 'Rice',
          season: 'kharif',
          category: 'cereal'
        }
      },
      {
        name: 'Wheat Growers Network',
        description: 'Community for wheat farmers. Discuss varieties, irrigation, and harvest techniques.',
        type: 'crop',
        category: 'wheat',
        icon: 'crop',
        memberCount: 32000,
        cropData: {
          cropName: 'Wheat',
          season: 'rabi',
          category: 'cereal'
        }
      },
      {
        name: 'Sugarcane Farmers',
        description: 'Sugarcane cultivation tips, mill rates, and farming innovations.',
        type: 'crop',
        category: 'sugarcane',
        icon: 'crop',
        memberCount: 18000,
        cropData: {
          cropName: 'Sugarcane',
          season: 'perennial',
          category: 'cash_crop'
        }
      },
      {
        name: 'Tomato Farmers',
        description: 'Tomato farming community. Share pest control, varieties, and market insights.',
        type: 'crop',
        category: 'tomato',
        icon: 'crop',
        memberCount: 15000,
        cropData: {
          cropName: 'Tomato',
          season: 'kharif',
          category: 'vegetable'
        }
      },
      {
        name: 'Potato Growers',
        description: 'Potato cultivation techniques, storage methods, and price discussions.',
        type: 'crop',
        category: 'potato',
        icon: 'crop',
        memberCount: 12000,
        cropData: {
          cropName: 'Potato',
          season: 'rabi',
          category: 'vegetable'
        }
      },
      {
        name: 'Onion Farmers',
        description: 'Onion farming community for sharing cultivation and market strategies.',
        type: 'crop',
        category: 'onion',
        icon: 'crop',
        memberCount: 10000,
        cropData: {
          cropName: 'Onion',
          season: 'rabi',
          category: 'vegetable'
        }
      },
      {
        name: 'Chili Pepper Farmers',
        description: 'Spice up your farming! Community for chili and pepper growers.',
        type: 'crop',
        category: 'chili',
        icon: 'crop',
        memberCount: 8000,
        cropData: {
          cropName: 'Chili',
          season: 'kharif',
          category: 'vegetable'
        }
      },
      {
        name: 'Organic Farmers India',
        description: 'Sustainable and organic farming practices. Chemical-free agriculture community.',
        type: 'interest',
        category: 'organic',
        icon: 'interest',
        memberCount: 25000
      },
      {
        name: 'Dairy Farmers Network',
        description: 'Milk production, cattle care, and dairy business discussions.',
        type: 'interest',
        category: 'dairy',
        icon: 'interest',
        memberCount: 35000
      },
      {
        name: 'Poultry Farmers',
        description: 'Chicken, egg production, and poultry business community.',
        type: 'interest',
        category: 'poultry',
        icon: 'interest',
        memberCount: 20000
      },
      {
        name: 'Fruit Growers',
        description: 'Mango, apple, banana and other fruit cultivation community.',
        type: 'crop',
        category: 'fruits',
        icon: 'crop',
        memberCount: 15000,
        cropData: {
          cropName: 'Mixed Fruits',
          season: 'perennial',
          category: 'fruit'
        }
      },
      {
        name: 'Smart Farming Tech',
        description: 'Modern farming technology, IoT, drones, and precision agriculture.',
        type: 'interest',
        category: 'technology',
        icon: 'interest',
        memberCount: 12000
      }
    ];
    
    // Sample location-based communities
    const locationCommunities = [
      {
        name: 'Farmers of Punjab',
        description: 'Connect with fellow farmers across Punjab state.',
        type: 'location',
        category: 'state',
        icon: 'location',
        memberCount: 85000,
        locationData: {
          country: 'India',
          state: 'Punjab',
          level: 'state'
        }
      },
      {
        name: 'Farmers of Uttar Pradesh',
        description: 'Largest farming community in India. UP farmers unite!',
        type: 'location',
        category: 'state',
        icon: 'location',
        memberCount: 120000,
        locationData: {
          country: 'India',
          state: 'Uttar Pradesh',
          level: 'state'
        }
      },
      {
        name: 'Farmers of Maharashtra',
        description: 'Maharashtra farming community for all crops and regions.',
        type: 'location',
        category: 'state',
        icon: 'location',
        memberCount: 95000,
        locationData: {
          country: 'India',
          state: 'Maharashtra',
          level: 'state'
        }
      }
    ];
    
    // Insert all communities
    const allCommunities = [...cropCommunities, ...locationCommunities];
    await Community.insertMany(allCommunities);
    
    console.log(`✅ Seeded ${allCommunities.length} communities successfully!`);
    
  } catch (error) {
    console.error('❌ Error seeding communities:', error);
  }
};

// Run if called directly
if (require.main === module) {
  mongoose.connect('mongodb://localhost:27017/agri-connect')
    .then(() => {
      console.log('📦 Connected to MongoDB');
      return seedCommunities();
    })
    .then(() => {
      console.log('🎉 Seeding completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedCommunities;