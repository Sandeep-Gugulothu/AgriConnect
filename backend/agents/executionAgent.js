const Crop = require('../models/Crop');
const FarmerProfile = require('../models/FarmerProfile');

class ExecutionAgent {
  constructor() {
    this.name = 'Adaptive Execution Agent';
  }

  // Get daily tasks for a specific crop
  async getDailyTasks(cropId, userId) {
    try {
      const crop = await Crop.findOne({ _id: cropId, userId });
      if (!crop) return { tasks: [], alerts: [] };

      const daysSincePlanting = this.calculateDaysSincePlanting(crop.plantingDate);
      const currentPhase = this.getCurrentPhase(crop.cropName, daysSincePlanting);
      
      const tasks = this.generateDailyTasks(crop, daysSincePlanting, currentPhase);
      const alerts = await this.generateAlerts(crop, daysSincePlanting);
      
      return {
        crop: crop.cropName,
        day: daysSincePlanting,
        phase: currentPhase,
        tasks,
        alerts,
        nextMilestone: this.getNextMilestone(crop.cropName, daysSincePlanting)
      };
    } catch (error) {
      console.error('Error getting daily tasks:', error);
      return { tasks: [], alerts: [] };
    }
  }

  calculateDaysSincePlanting(plantingDate) {
    if (!plantingDate) return 0;
    const today = new Date();
    const planted = new Date(plantingDate);
    return Math.floor((today - planted) / (1000 * 60 * 60 * 24));
  }

  getCurrentPhase(cropName, daysSincePlanting) {
    const phases = this.getCropPhases(cropName);
    const currentPhase = phases.find(phase => 
      daysSincePlanting >= phase.start && daysSincePlanting <= phase.end
    );
    return currentPhase ? currentPhase.name : 'Planning';
  }

  getCropPhases(cropName) {
    const cropPhases = {
      rice: [
        { name: 'Nursery', start: 0, end: 21 },
        { name: 'Transplanting', start: 22, end: 28 },
        { name: 'Vegetative Growth', start: 29, end: 60 },
        { name: 'Reproductive Stage', start: 61, end: 90 },
        { name: 'Maturation', start: 91, end: 120 }
      ],
      wheat: [
        { name: 'Germination', start: 0, end: 15 },
        { name: 'Tillering', start: 16, end: 45 },
        { name: 'Stem Extension', start: 46, end: 75 },
        { name: 'Flowering', start: 76, end: 95 },
        { name: 'Grain Filling', start: 96, end: 110 }
      ],
      tomato: [
        { name: 'Seedling', start: 0, end: 14 },
        { name: 'Transplanting', start: 15, end: 21 },
        { name: 'Vegetative Growth', start: 22, end: 45 },
        { name: 'Flowering', start: 46, end: 65 },
        { name: 'Fruiting', start: 66, end: 90 }
      ]
    };
    return cropPhases[cropName.toLowerCase()] || [];
  }

  generateDailyTasks(crop, daysSincePlanting, currentPhase) {
    const cropName = crop.cropName.toLowerCase();
    const tasks = [];

    // Phase-specific tasks
    if (cropName === 'rice') {
      tasks.push(...this.getRiceTasks(daysSincePlanting, currentPhase));
    } else if (cropName === 'wheat') {
      tasks.push(...this.getWheatTasks(daysSincePlanting, currentPhase));
    } else if (cropName === 'tomato') {
      tasks.push(...this.getTomatoTasks(daysSincePlanting, currentPhase));
    }

    // General daily tasks
    tasks.push(...this.getGeneralTasks(daysSincePlanting));

    return tasks.map(task => ({
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0]
    }));
  }

  getRiceTasks(day, phase) {
    const tasks = [];
    
    if (phase === 'Nursery') {
      if (day <= 7) tasks.push({ task: 'Check seed germination', priority: 'high', type: 'inspection' });
      if (day >= 10 && day <= 15) tasks.push({ task: 'Apply first fertilizer dose (DAP)', priority: 'high', type: 'fertilizer' });
      if (day >= 18) tasks.push({ task: 'Prepare main field for transplanting', priority: 'medium', type: 'preparation' });
    }
    
    if (phase === 'Transplanting') {
      tasks.push({ task: 'Transplant seedlings (6-8 inches tall)', priority: 'critical', type: 'planting' });
      tasks.push({ task: 'Maintain 2-3 cm water level', priority: 'high', type: 'irrigation' });
    }
    
    if (phase === 'Vegetative Growth') {
      if (day >= 35 && day <= 40) tasks.push({ task: 'Apply second fertilizer dose (Urea)', priority: 'high', type: 'fertilizer' });
      if (day >= 45) tasks.push({ task: 'Monitor for stem borer', priority: 'medium', type: 'pest_control' });
    }
    
    return tasks;
  }

  getWheatTasks(day, phase) {
    const tasks = [];
    
    if (phase === 'Germination') {
      tasks.push({ task: 'Check seed germination rate', priority: 'high', type: 'inspection' });
      if (day >= 10) tasks.push({ task: 'Light irrigation if needed', priority: 'medium', type: 'irrigation' });
    }
    
    if (phase === 'Tillering') {
      if (day >= 25 && day <= 30) tasks.push({ task: 'Apply first top dressing (Urea)', priority: 'high', type: 'fertilizer' });
      tasks.push({ task: 'Weed control', priority: 'medium', type: 'weeding' });
    }
    
    return tasks;
  }

  getTomatoTasks(day, phase) {
    const tasks = [];
    
    if (phase === 'Seedling') {
      tasks.push({ task: 'Check seedling health', priority: 'high', type: 'inspection' });
      tasks.push({ task: 'Maintain nursery moisture', priority: 'medium', type: 'irrigation' });
    }
    
    if (phase === 'Flowering') {
      tasks.push({ task: 'Monitor for blossom end rot', priority: 'high', type: 'disease_control' });
      tasks.push({ task: 'Support flowering plants', priority: 'medium', type: 'support' });
    }
    
    return tasks;
  }

  getGeneralTasks(day) {
    const tasks = [];
    
    // Weekly tasks
    if (day % 7 === 0) {
      tasks.push({ task: 'General field inspection', priority: 'medium', type: 'inspection' });
      tasks.push({ task: 'Check irrigation system', priority: 'medium', type: 'maintenance' });
    }
    
    // Weather-dependent tasks (mock - would integrate with weather API)
    const weather = this.getMockWeather();
    if (weather.rainProbability > 70) {
      tasks.push({ task: 'Prepare for rain - check drainage', priority: 'high', type: 'weather_prep' });
    }
    
    return tasks;
  }

  async generateAlerts(crop, daysSincePlanting) {
    const alerts = [];
    const weather = this.getMockWeather();
    
    // Weather alerts
    if (weather.temperature > 35) {
      alerts.push({
        type: 'weather',
        severity: 'high',
        message: 'High temperature alert! Increase irrigation frequency.',
        action: 'Provide extra water to crops'
      });
    }
    
    if (weather.rainProbability > 80) {
      alerts.push({
        type: 'weather',
        severity: 'medium',
        message: 'Heavy rain expected. Check field drainage.',
        action: 'Ensure proper water drainage'
      });
    }
    
    // Crop-specific alerts
    const cropAlerts = this.getCropSpecificAlerts(crop.cropName, daysSincePlanting);
    alerts.push(...cropAlerts);
    
    return alerts;
  }

  getCropSpecificAlerts(cropName, day) {
    const alerts = [];
    
    if (cropName.toLowerCase() === 'rice') {
      if (day >= 45 && day <= 55) {
        alerts.push({
          type: 'pest',
          severity: 'medium',
          message: 'Peak stem borer season. Monitor closely.',
          action: 'Apply recommended pesticide if needed'
        });
      }
    }
    
    if (cropName.toLowerCase() === 'tomato') {
      if (day >= 30 && day <= 40) {
        alerts.push({
          type: 'disease',
          severity: 'high',
          message: 'Early blight risk period. Watch for leaf spots.',
          action: 'Apply fungicide preventively'
        });
      }
    }
    
    return alerts;
  }

  getNextMilestone(cropName, daysSincePlanting) {
    const phases = this.getCropPhases(cropName);
    const nextPhase = phases.find(phase => phase.start > daysSincePlanting);
    
    if (nextPhase) {
      const daysToNext = nextPhase.start - daysSincePlanting;
      return {
        phase: nextPhase.name,
        daysRemaining: daysToNext,
        description: `Next phase: ${nextPhase.name} in ${daysToNext} days`
      };
    }
    
    return {
      phase: 'Harvest',
      daysRemaining: 0,
      description: 'Ready for harvest!'
    };
  }

  getMockWeather() {
    // Mock weather data - would integrate with real weather API
    return {
      temperature: 28 + Math.random() * 10,
      humidity: 60 + Math.random() * 30,
      rainProbability: Math.random() * 100,
      condition: 'partly_cloudy'
    };
  }

  // Adaptive planning based on conditions
  async adaptPlan(cropId, userId, conditions) {
    try {
      const crop = await Crop.findOne({ _id: cropId, userId });
      if (!crop) return null;

      const adaptations = [];
      
      // Weather-based adaptations
      if (conditions.weather) {
        if (conditions.weather.rainExpected) {
          adaptations.push({
            type: 'irrigation',
            change: 'reduce',
            reason: 'Rain expected - reduce irrigation',
            priority: 'medium'
          });
        }
        
        if (conditions.weather.temperature > 35) {
          adaptations.push({
            type: 'irrigation',
            change: 'increase',
            reason: 'High temperature - increase watering',
            priority: 'high'
          });
        }
      }
      
      // Market-based adaptations
      if (conditions.marketPrice && conditions.marketPrice.trend === 'falling') {
        adaptations.push({
          type: 'harvest',
          change: 'accelerate',
          reason: 'Market prices falling - consider early harvest',
          priority: 'medium'
        });
      }
      
      return {
        cropId,
        adaptations,
        timestamp: new Date(),
        confidence: 0.85
      };
    } catch (error) {
      console.error('Error adapting plan:', error);
      return null;
    }
  }
}

module.exports = new ExecutionAgent();