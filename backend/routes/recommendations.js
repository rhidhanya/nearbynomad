const express = require('express');
const { getRecommendations } = require('../services/recommendationService');

const router = express.Router();

// POST /api/recommendations - Get personalized recommendations
router.post('/', async (req, res) => {
  try {
    const preferences = req.body;
    
    // Validate required fields
    if (!preferences) {
      return res.status(400).json({ 
        error: 'Preferences are required',
        message: 'Please provide user preferences including mood, interests, energy level, etc.'
      });
    }

    // Get recommendations using the service
    const result = getRecommendations(preferences);
    
    res.json({
      success: true,
      data: result,
      message: `Found ${result.recommendations.length} personalized recommendations`
    });
  } catch (error) {
    console.error('Error in recommendations route:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to generate recommendations',
      details: error.message 
    });
  }
});

// GET /api/recommendations - Get all places (for testing)
router.get('/', async (req, res) => {
  try {
    const { loadPlacesData } = require('../services/recommendationService');
    const places = loadPlacesData();
    
    res.json({
      success: true,
      data: places,
      message: `Loaded ${places.length} places`
    });
  } catch (error) {
    console.error('Error loading places:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to load places',
      details: error.message 
    });
  }
});

module.exports = router;