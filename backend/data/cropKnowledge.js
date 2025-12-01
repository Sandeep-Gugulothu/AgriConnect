// Agricultural knowledge base - NOT training data
const cropKnowledge = {
  rice: {
    duration: 120, // days
    stages: [
      {
        name: 'Land Preparation',
        duration: 7,
        tasks: ['Plowing', 'Leveling', 'Apply organic manure'],
        waterRequirement: 'Flooded field',
        criticalFactors: ['Soil preparation', 'Water availability']
      },
      {
        name: 'Seedling',
        duration: 21,
        tasks: ['Seed soaking', 'Nursery preparation', 'Seedling care'],
        waterRequirement: '2-3 cm water depth',
        criticalFactors: ['Temperature 25-30°C', 'Protection from birds']
      },
      {
        name: 'Vegetative',
        duration: 35,
        tasks: ['Nitrogen application', 'Weed control', 'Water management'],
        waterRequirement: '5-10 cm water depth',
        criticalFactors: ['Fertilizer timing', 'Pest monitoring']
      },
      {
        name: 'Flowering',
        duration: 35,
        tasks: ['Reduce irrigation', 'Potassium application', 'Disease monitoring'],
        waterRequirement: '2-5 cm water depth',
        criticalFactors: ['No water stress', 'Temperature control']
      },
      {
        name: 'Maturity',
        duration: 22,
        tasks: ['Check grain maturity', 'Prepare for harvest', 'Drain field'],
        waterRequirement: 'Drain 10 days before harvest',
        criticalFactors: ['80% grain golden', 'Moisture content 20-22%']
      }
    ],
    soilRequirements: {
      type: ['Clay', 'Clay loam'],
      pH: { min: 5.5, max: 7.0 }
    },
    climateRequirements: {
      temperature: { min: 20, max: 35 },
      rainfall: { min: 1000, max: 2000 }
    },
    commonProblems: [
      {
        stage: 'Seedling',
        problem: 'Damping off',
        symptoms: ['Seedling collapse', 'Root rot'],
        solution: 'Fungicide treatment, reduce water'
      },
      {
        stage: 'Vegetative',
        problem: 'Leaf blast',
        symptoms: ['Brown spots on leaves'],
        solution: 'Fungicide spray, balanced nutrition'
      }
    ]
  },

  wheat: {
    duration: 140,
    stages: [
      {
        name: 'Land Preparation',
        duration: 10,
        tasks: ['Deep plowing', 'Harrowing', 'Leveling'],
        waterRequirement: 'Pre-sowing irrigation'
      },
      {
        name: 'Sowing',
        duration: 7,
        tasks: ['Seed treatment', 'Sowing', 'Light irrigation'],
        waterRequirement: 'Light irrigation after sowing'
      },
      {
        name: 'Vegetative',
        duration: 60,
        tasks: ['Nitrogen application', 'Irrigation', 'Weed management'],
        waterRequirement: 'Irrigation every 20-25 days'
      },
      {
        name: 'Flowering',
        duration: 21,
        tasks: ['Critical irrigation', 'Disease monitoring'],
        waterRequirement: 'Critical irrigation needed'
      },
      {
        name: 'Maturity',
        duration: 42,
        tasks: ['Check maturity', 'Harvest preparation'],
        waterRequirement: 'No irrigation'
      }
    ],
    soilRequirements: {
      type: ['Loam', 'Clay loam'],
      pH: { min: 6.0, max: 7.5 }
    },
    climateRequirements: {
      temperature: { min: 10, max: 25 },
      rainfall: { min: 300, max: 1000 }
    }
  }
};

module.exports = cropKnowledge;