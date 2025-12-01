const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI with error handling
let genAI, model;

// Try different model names
const modelNames = [
  'gemini-pro',
  'gemini-1.5-pro',
  'gemini-1.0-pro',
  'models/gemini-pro',
  'models/gemini-1.5-pro'
];

const initializeGemini = async () => {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your-gemini-api-key-here') {
    console.log('⚠️ Gemini API key not configured');
    return;
  }

  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Try the working model names
    const testModels = [
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-pro'
    ];
    
    for (const modelName of testModels) {
      try {
        const testModel = genAI.getGenerativeModel({ model: modelName });
        
        // Test with a simple request
        const result = await testModel.generateContent('Hi');
        const response = await result.response;
        const text = response.text();
        
        if (text) {
          model = testModel;
          return;
        }
      } catch (error) {
        // Continue to next model
      }
    }
    
    model = null;
    
  } catch (error) {
    console.error('❌ Gemini initialization failed:', error.message);
    model = null;
  }
};

// Initialize Gemini
initializeGemini().catch(console.error);

// Query Classification System
const classifyQuery = (message) => {
  const msg = message.toLowerCase();
  
  // AGENTIC AI handles structured queries
  const agenticPatterns = [
    /what crop.*recommend|suggest.*crop|best crop/,
    /fertilizer.*schedule|how much.*fertilizer|fertilizer.*quantity/,
    /irrigation.*schedule|water.*requirement|when.*water/,
    /market.*price|price.*today|current.*price/,
    /planting.*date|sowing.*time|when.*plant/
  ];
  
  // LLM handles complex/conversational queries
  const llmPatterns = [
    /why.*yellow|leaves.*turning|disease.*symptom/,
    /compare.*neighbor|better.*than|explain.*why/,
    /problem.*with|what.*wrong|help.*diagnose/,
    /tell.*me.*about|explain.*how|can.*you/
  ];
  
  if (agenticPatterns.some(pattern => pattern.test(msg))) {
    return 'AGENTIC';
  }
  
  if (llmPatterns.some(pattern => pattern.test(msg))) {
    return 'LLM';
  }
  
  // Default to AGENTIC for farming-related queries, LLM for others
  const farmingKeywords = ['crop', 'plant', 'seed', 'soil', 'water', 'fertilizer', 'harvest', 'farm'];
  const hasFarmingKeywords = farmingKeywords.some(keyword => msg.includes(keyword));
  
  return hasFarmingKeywords ? 'AGENTIC' : 'LLM';
};

// Agentic AI Responses (Fast & Structured)
const getAgenticResponse = (message, farmerProfile) => {
  const msg = message.toLowerCase();
  
  // Crop recommendation
  if (msg.includes('crop') && (msg.includes('recommend') || msg.includes('suggest') || msg.includes('should'))) {
    if (farmerProfile) {
      const { soilType, waterSource, landSize, location } = farmerProfile;
      
      if (soilType === 'clay' && waterSource === 'bore') {
        return `🌾 **Perfect Match for Your ${landSize} Acres!**

**Top Recommendation: PADDY (Rice)**
- ✅ Clay soil retains water perfectly for rice
- ✅ Bore well provides reliable water supply
- 💰 Expected profit: ₹45,000/acre
- ⏱️ Duration: 120 days

**Alternative Options:**
1. **Wheat** - Winter crop, ₹30,000/acre profit
2. **Sugarcane** - High investment but ₹80,000/acre profit

**Next Steps:**
1. Visit Fields section to add this crop
2. Get detailed cultivation plan
3. Start with seed selection

Would you like the complete cultivation schedule for paddy?`;
      }
    }
    
    return `🌱 I need your land details for personalized recommendations! Please visit the **Fields** section to add:
- Land size and soil type
- Water source availability  
- Location details

Then I can suggest the perfect crops for maximum profit! 🚀`;
  }
  
  // Fertilizer queries
  if (msg.includes('fertilizer') || msg.includes('urea') || msg.includes('dap')) {
    return `🧪 **Fertilizer Calculator**

**For Paddy (per acre):**
- Urea: 175kg total (split in 4 doses)
- DAP: 100kg at transplanting
- Potash: 50kg at transplanting
- **Total cost: ~₹8,000/acre**

**For Wheat (per acre):**
- Urea: 120kg total (split in 3 doses)
- DAP: 100kg at sowing
- **Total cost: ~₹6,000/acre**

**Application Schedule:**
1. Basal dose at planting
2. First top dressing at 21 days
3. Second at 45 days
4. Final at 65 days (for paddy)

Need specific quantities for your crop and land size?`;
  }
  
  // Market prices
  if (msg.includes('price') || msg.includes('market')) {
    return `💰 **Today's Market Rates**

**Grains:**
- Paddy: ₹1,800-2,200/quintal
- Wheat: ₹2,000-2,300/quintal
- Corn: ₹1,600-1,900/quintal

**Cash Crops:**
- Sugarcane: ₹280-320/quintal
- Cotton: ₹5,800-6,200/quintal

**Vegetables:**
- Tomato: ₹800-1,500/quintal (seasonal)
- Onion: ₹1,200-1,800/quintal
- Potato: ₹800-1,200/quintal

**💡 Pro Tips:**
- Mandi prices usually 10-15% higher
- Direct buyer contact for bulk sales
- Check government procurement rates

Want specific market analysis for your area?`;
  }
  
  // Default agentic response
  return `🌾 **AgriConnect AI Assistant**

I can help you with:
📊 **Crop Recommendations** - Best crops for your land
📅 **Cultivation Planning** - Day-by-day farming schedule
🧪 **Fertilizer Guidance** - Exact quantities and timing
💰 **Market Information** - Current prices and trends
🌧️ **Weather Alerts** - Farming-specific forecasts

What specific farming challenge can I solve for you today?`;
};

// Gemini AI Response
const getLLMResponse = async (message, farmerProfile, userCrops) => {
  if (!model) {
    return 'AI service is not available. Please check the configuration.';
  }

  try {
    // Build comprehensive context for Gemini
    let context = `You are an expert agricultural advisor specializing in Indian farming. Provide practical, actionable advice.

🌾 FARMER PROFILE:`;
    
    if (farmerProfile) {
      context += `
• Land: ${farmerProfile.landSize} acres
• Soil: ${farmerProfile.soilType}
• Water: ${farmerProfile.waterSource}
• Location: ${farmerProfile.location.district}, ${farmerProfile.location.state}
• Experience: ${farmerProfile.experience}
• Goals: ${farmerProfile.goals}`;
    } else {
      context += `
• No farmer profile available`;
    }
    
    if (userCrops && userCrops.length > 0) {
      context += `\n\n🌱 CURRENT CROPS:`;
      userCrops.forEach(crop => {
        context += `\n• ${crop.cropName} (${crop.variety || 'standard variety'}): ${crop.landSize} acres - Status: ${crop.status}`;
        if (crop.plantingDate) {
          context += ` - Planted: ${new Date(crop.plantingDate).toLocaleDateString()}`;
        }
      });
    }
    
    context += `\n\n❓ FARMER'S QUESTION: "${message}"

📋 INSTRUCTIONS:
- Provide specific, actionable advice for Indian farming conditions
- Include relevant quantities, timings, and costs in Indian Rupees
- Use emojis to make responses engaging
- Be concise but comprehensive
- Consider local climate and soil conditions
- Suggest practical next steps`;

    const result = await model.generateContent(context);
    const response = await result.response;
    const text = response.text();
    
    return text;
    
  } catch (error) {
    console.error('❌ Gemini API Error:', error);
    return `I'm experiencing technical difficulties connecting to the AI service. 

🔧 **Troubleshooting:**
- Please try your question again in a moment
- For immediate help, check the Fields section for cultivation guides
- Join our farming communities for peer advice

**Error details:** ${error.message}`;
  }
};

// Hybrid: Try Gemini, fallback to Agentic
const getHybridResponse = async (message, farmerProfile, userCrops) => {
  if (model) {
    // Try Gemini first
    const response = await getLLMResponse(message, farmerProfile, userCrops);
    if (!response.includes('technical difficulties')) {
      return {
        response,
        source: 'gemini',
        processingTime: 'smart'
      };
    }
  }
  
  // Fallback to agentic response
  return {
    response: getAgenticResponse(message, farmerProfile),
    source: 'agentic',
    processingTime: 'instant'
  };
};

module.exports = { getHybridResponse };