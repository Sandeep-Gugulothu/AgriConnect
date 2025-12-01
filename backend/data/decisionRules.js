// Decision rules for agentic AI - NOT machine learning training
const decisionRules = {
  
  // Weather-based decisions
  weatherRules: [
    {
      condition: (weather, cropStage) => weather.temperature > 40 && cropStage === 'seedling',
      action: 'URGENT_IRRIGATION',
      priority: 'CRITICAL',
      message: 'Extreme heat detected - increase irrigation immediately'
    },
    {
      condition: (weather, cropStage) => weather.rainfall > 100 && cropStage === 'flowering',
      action: 'DRAINAGE_ALERT',
      priority: 'HIGH',
      message: 'Heavy rainfall during flowering - ensure proper drainage'
    },
    {
      condition: (weather) => weather.humidity > 90,
      action: 'DISEASE_WARNING',
      priority: 'MEDIUM',
      message: 'High humidity increases disease risk - monitor closely'
    }
  ],

  // Growth stage decisions
  stageRules: [
    {
      condition: (stage, daysInStage, expectedDuration) => daysInStage > expectedDuration * 1.2,
      action: 'GROWTH_DELAY_ALERT',
      priority: 'MEDIUM',
      message: 'Crop growth slower than expected - check nutrition and water'
    },
    {
      condition: (stage) => stage === 'flowering',
      action: 'CRITICAL_CARE_PERIOD',
      priority: 'HIGH',
      message: 'Critical flowering stage - maintain consistent water and nutrition'
    }
  ],

  // Market-based decisions
  marketRules: [
    {
      condition: (priceChange, cropMaturity) => priceChange > 15 && cropMaturity > 80,
      action: 'EARLY_HARVEST_OPPORTUNITY',
      priority: 'HIGH',
      message: 'Prices up 15%+ and crop nearly ready - consider early harvest'
    },
    {
      condition: (priceChange) => priceChange < -20,
      action: 'HOLD_HARVEST',
      priority: 'MEDIUM',
      message: 'Prices dropped significantly - wait for recovery if possible'
    }
  ],

  // Resource optimization rules
  resourceRules: [
    {
      condition: (soilMoisture, weather) => soilMoisture < 30 && weather.rainfall === 0,
      action: 'IRRIGATION_NEEDED',
      priority: 'HIGH',
      message: 'Soil moisture low and no rain forecast - irrigate within 24 hours'
    },
    {
      condition: (cropStage, lastFertilizer) => cropStage === 'vegetative' && lastFertilizer > 21,
      action: 'FERTILIZER_APPLICATION',
      priority: 'MEDIUM',
      message: 'Vegetative stage requires nitrogen - apply fertilizer'
    }
  ],

  // Pest and disease rules
  pestRules: [
    {
      condition: (temperature, humidity, cropStage) => 
        temperature > 25 && humidity > 80 && cropStage === 'vegetative',
      action: 'PEST_MONITORING',
      priority: 'MEDIUM',
      message: 'Conditions favorable for pests - increase monitoring'
    }
  ]
};

// Rule evaluation engine
const evaluateRules = (ruleSet, ...params) => {
  const triggeredRules = [];
  
  ruleSet.forEach(rule => {
    try {
      if (rule.condition(...params)) {
        triggeredRules.push({
          action: rule.action,
          priority: rule.priority,
          message: rule.message,
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.log(`Rule evaluation error: ${error.message}`);
    }
  });
  
  return triggeredRules.sort((a, b) => {
    const priorityOrder = { 'CRITICAL': 3, 'HIGH': 2, 'MEDIUM': 1, 'LOW': 0 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};

module.exports = { decisionRules, evaluateRules };