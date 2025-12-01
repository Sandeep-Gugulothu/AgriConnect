const express = require('express');
const router = express.Router();
const FarmerProfile = require('../models/FarmerProfile');
const Crop = require('../models/Crop');
const { protect } = require('../middleware/auth');

// Create or update farmer profile
router.post('/profile', protect, async (req, res) => {
  try {
    const {
      landSize,
      soilType,
      waterSource,
      location,
      experience,
      budget,
      goals,
      previousCrops
    } = req.body;

    // Calculate profile score based on inputs
    let profileScore = 0;
    
    // Land size scoring (larger farms get higher scores)
    if (landSize >= 5) profileScore += 30;
    else if (landSize >= 2) profileScore += 20;
    else profileScore += 10;

    // Soil type scoring (loamy is best)
    if (soilType === 'loamy') profileScore += 25;
    else if (soilType === 'clay') profileScore += 20;
    else if (soilType === 'sandy') profileScore += 15;
    else profileScore += 10;

    // Water source scoring (bore well is most reliable)
    if (waterSource === 'bore') profileScore += 25;
    else if (waterSource === 'canal') profileScore += 20;
    else if (waterSource === 'river') profileScore += 15;
    else profileScore += 10;

    // Experience scoring
    if (experience === 'expert') profileScore += 20;
    else if (experience === 'intermediate') profileScore += 15;
    else profileScore += 10;

    const profileData = {
      userId: req.user.id,
      landSize,
      soilType,
      waterSource,
      location,
      experience,
      budget,
      goals,
      previousCrops,
      profileScore
    };

    // Check if profile already exists
    let profile = await FarmerProfile.findOne({ userId: req.user.id });
    
    if (profile) {
      // Update existing profile
      profile = await FarmerProfile.findOneAndUpdate(
        { userId: req.user.id },
        profileData,
        { new: true }
      );
    } else {
      // Create new profile
      profile = new FarmerProfile(profileData);
      await profile.save();
    }

    res.json({
      message: 'Profile saved successfully',
      profile
    });
  } catch (error) {
    console.error('Error saving farmer profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get farmer profile
router.get('/profile', protect, async (req, res) => {
  try {
    const profile = await FarmerProfile.findOne({ userId: req.user.id });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Error fetching farmer profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all crops for a user
router.get('/crops', protect, async (req, res) => {
  try {
    const crops = await Crop.find({ userId: req.user.id }).sort({ createdAt: -1 });
    
    // Auto-update status for all crops
    const updatedCrops = await Promise.all(crops.map(async (crop) => {
      const autoStatus = calculateCropStatus(crop);
      if (crop.status !== autoStatus) {
        crop.status = autoStatus;
        await crop.save();
      }
      return crop;
    }));
    
    res.json(updatedCrops);
  } catch (error) {
    console.error('Error fetching crops:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new crop
router.post('/crops', protect, async (req, res) => {
  try {
    const cropData = {
      ...req.body,
      userId: req.user.id
    };
    
    const crop = new Crop(cropData);
    await crop.save();
    
    res.status(201).json(crop);
  } catch (error) {
    console.error('Error adding crop:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Calculate automatic status based on planting date
const calculateCropStatus = (crop) => {
  if (!crop.plantingDate) {
    return 'planning';
  }

  const plantingDate = new Date(crop.plantingDate);
  const today = new Date();
  const daysSincePlanting = Math.floor((today - plantingDate) / (1000 * 60 * 60 * 24));

  // Crop-specific growth phases
  const cropPhases = {
    rice: { planted: 0, growing: 21, harvested: 120 },
    wheat: { planted: 0, growing: 15, harvested: 110 },
    corn: { planted: 0, growing: 10, harvested: 90 },
    tomato: { planted: 0, growing: 30, harvested: 80 },
    potato: { planted: 0, growing: 20, harvested: 90 },
    onion: { planted: 0, growing: 25, harvested: 120 },
    sugarcane: { planted: 0, growing: 60, harvested: 365 },
    cotton: { planted: 0, growing: 30, harvested: 180 }
  };

  const phases = cropPhases[crop.cropName.toLowerCase()] || { planted: 0, growing: 20, harvested: 100 };

  if (daysSincePlanting < 0) {
    return 'planning';
  } else if (daysSincePlanting >= 0 && daysSincePlanting < phases.growing) {
    return 'planted';
  } else if (daysSincePlanting >= phases.growing && daysSincePlanting < phases.harvested) {
    return 'growing';
  } else {
    return 'harvested';
  }
};

// Get single crop details
router.get('/crops/:id', protect, async (req, res) => {
  try {
    const crop = await Crop.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    // Auto-update status based on planting date
    const autoStatus = calculateCropStatus(crop);
    if (crop.status !== autoStatus) {
      crop.status = autoStatus;
      await crop.save();
    }
    
    res.json(crop);
  } catch (error) {
    console.error('Error fetching crop:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update crop status
router.put('/crops/:id', protect, async (req, res) => {
  try {
    const crop = await Crop.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }
    
    res.json(crop);
  } catch (error) {
    console.error('Error updating crop:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get tasks for a crop
router.get('/crops/:id/tasks', protect, async (req, res) => {
  try {
    // Mock data for now - would be stored in database
    const tasks = [
      { id: 1, cropId: req.params.id, phase: 'Nursery Preparation', task: 'Soak seeds for 24 hours', completed: true, dueDate: '2024-01-15' },
      { id: 2, cropId: req.params.id, phase: 'Nursery Preparation', task: 'Prepare nursery bed', completed: true, dueDate: '2024-01-16' },
      { id: 3, cropId: req.params.id, phase: 'Nursery Preparation', task: 'Sow seeds', completed: false, dueDate: '2024-01-17' },
      { id: 4, cropId: req.params.id, phase: 'Nursery Preparation', task: 'Maintain water level', completed: false, dueDate: '2024-01-18' }
    ];
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task completion
router.put('/crops/:id/tasks/:taskId', protect, async (req, res) => {
  try {
    const { completed } = req.body;
    // In real implementation, update task in database
    res.json({ message: 'Task updated successfully', completed });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get notes for a crop
router.get('/crops/:id/notes', protect, async (req, res) => {
  try {
    // Mock data for now
    const notes = [
      { id: 1, cropId: req.params.id, date: '2024-01-15', note: 'Seeds soaked successfully. Good germination expected.', weather: 'Sunny, 28°C' },
      { id: 2, cropId: req.params.id, date: '2024-01-14', note: 'Prepared the field. Soil looks healthy after recent rain.', weather: 'Cloudy, 25°C' }
    ];
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add note for a crop
router.post('/crops/:id/notes', protect, async (req, res) => {
  try {
    const { note, weather } = req.body;
    const newNote = {
      id: Date.now(),
      cropId: req.params.id,
      date: new Date().toISOString().split('T')[0],
      note,
      weather: weather || 'N/A'
    };
    // In real implementation, save to database
    res.status(201).json(newNote);
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get expenses for a crop
router.get('/crops/:id/expenses', protect, async (req, res) => {
  try {
    // Mock data for now
    const expenses = [
      { id: 1, cropId: req.params.id, date: '2024-01-15', description: 'Premium Rice Seeds', amount: 2500, category: 'seeds' },
      { id: 2, cropId: req.params.id, date: '2024-01-14', description: 'Organic Fertilizer', amount: 1800, category: 'fertilizer' },
      { id: 3, cropId: req.params.id, date: '2024-01-13', description: 'Field Preparation', amount: 3000, category: 'labor' }
    ];
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add expense for a crop
router.post('/crops/:id/expenses', protect, async (req, res) => {
  try {
    const { description, amount, category } = req.body;
    const newExpense = {
      id: Date.now(),
      cropId: req.params.id,
      date: new Date().toISOString().split('T')[0],
      description,
      amount: parseFloat(amount),
      category
    };
    // In real implementation, save to database
    res.status(201).json(newExpense);
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get photos for a crop
router.get('/crops/:id/photos', protect, async (req, res) => {
  try {
    // Mock data for now
    const photos = [
      { id: 1, cropId: req.params.id, url: '/api/placeholder/300/200', date: '2024-01-15', caption: 'Day 1 - Seeds planted' },
      { id: 2, cropId: req.params.id, url: '/api/placeholder/300/200', date: '2024-01-10', caption: 'Field preparation complete' }
    ];
    res.json(photos);
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload photo for a crop
router.post('/crops/:id/photos', protect, async (req, res) => {
  try {
    const { caption } = req.body;
    // In real implementation, handle file upload and save to database
    const newPhoto = {
      id: Date.now(),
      cropId: req.params.id,
      url: '/api/placeholder/300/200', // Would be actual uploaded file URL
      date: new Date().toISOString().split('T')[0],
      caption: caption || `Progress photo - ${new Date().toLocaleDateString()}`
    };
    res.status(201).json(newPhoto);
  } catch (error) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get weather data for crop location
router.get('/crops/:id/weather', protect, async (req, res) => {
  try {
    // Mock weather data - in real implementation, integrate with weather API
    const weather = {
      current: { temp: 28, condition: 'Sunny', humidity: 65, rainfall: 0 },
      forecast: [
        { day: 'Today', temp: 28, condition: 'Sunny', rain: 0 },
        { day: 'Tomorrow', temp: 26, condition: 'Cloudy', rain: 20 },
        { day: 'Day 3', temp: 24, condition: 'Rainy', rain: 80 }
      ]
    };
    res.json(weather);
  } catch (error) {
    console.error('Error fetching weather:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get yield prediction for a crop
router.get('/crops/:id/yield-prediction', protect, async (req, res) => {
  try {
    const crop = await Crop.findOne({ _id: req.params.id, userId: req.user.id });
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    // Mock AI-powered yield prediction
    const yieldPredictions = {
      rice: { min: 4.5, max: 6.2, avg: 5.3, unit: 'tons/hectare' },
      wheat: { min: 3.8, max: 5.1, avg: 4.4, unit: 'tons/hectare' },
      corn: { min: 7.2, max: 9.8, avg: 8.5, unit: 'tons/hectare' }
    };

    const prediction = yieldPredictions[crop.cropName.toLowerCase()] || 
      { min: 3.0, max: 5.0, avg: 4.0, unit: 'tons/hectare' };

    // Calculate based on land size
    const landSizeHectares = crop.landSize * 0.4047; // Convert acres to hectares
    const totalYield = {
      min: (prediction.min * landSizeHectares).toFixed(1),
      max: (prediction.max * landSizeHectares).toFixed(1),
      avg: (prediction.avg * landSizeHectares).toFixed(1),
      unit: 'tons'
    };

    res.json({
      perHectare: prediction,
      totalExpected: totalYield,
      factors: [
        'Soil quality: Good',
        'Weather conditions: Favorable',
        'Water availability: Adequate',
        'Crop variety: High yielding'
      ],
      confidence: 85
    });
  } catch (error) {
    console.error('Error getting yield prediction:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;