const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect: auth } = require('../middleware/auth');

// WeatherAPI.com API key
const WEATHER_API_KEY = process.env.WEATHER_API_KEY || 'demo_key';

// Get weather data
router.get('/', auth, async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const location = lat && lon ? `${lat},${lon}` : 'Delhi';
    
    // Try to fetch real weather data from WeatherAPI.com
    if (WEATHER_API_KEY !== 'demo_key') {
      const weatherUrl = `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${location}&aqi=no`;
      const weatherResponse = await axios.get(weatherUrl);
      
      const data = weatherResponse.data;
      const weatherData = {
        temperature: Math.round(data.current.temp_c),
        humidity: data.current.humidity,
        rainChance: data.current.cloud,
        condition: data.current.condition.text,
        description: data.current.condition.text.toLowerCase(),
        location: `${data.location.name}, ${data.location.region}`,
        windSpeed: Math.round(data.current.wind_kph / 3.6), // Convert to m/s
        pressure: Math.round(data.current.pressure_mb)
      };
      
      res.json(weatherData);
    } else {
      // Fallback to realistic mock data
      const weatherData = {
        temperature: Math.floor(Math.random() * 15) + 20,
        humidity: Math.floor(Math.random() * 40) + 40,
        rainChance: Math.floor(Math.random() * 100),
        condition: 'Partly Cloudy',
        description: 'partly cloudy',
        location: 'Delhi',
        windSpeed: Math.floor(Math.random() * 10) + 2,
        pressure: Math.floor(Math.random() * 50) + 1000
      };
      
      res.json(weatherData);
    }
  } catch (error) {
    console.error('Weather API error:', error.message);
    
    // Fallback to mock data on error
    const fallbackData = {
      temperature: 28,
      humidity: 65,
      rainChance: 20,
      condition: 'Partly Cloudy',
      description: 'partly cloudy',
      location: 'Current Location',
      windSpeed: 5,
      pressure: 1013
    };
    
    res.json(fallbackData);
  }
});

module.exports = router;