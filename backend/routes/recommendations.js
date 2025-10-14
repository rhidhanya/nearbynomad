const express = require('express');
const router = express.Router();
const recommendationService = require('../services/recommendationService');
const placesService = require('../services/placesService');

// POST /api/recommendations/generate - Generate personalized recommendations
router.post('/generate', async (req, res) => {
  try {
    const {
      userLocation,
      preferences,
      radius = 1000
    } = req.body;

    // Validate required fields
    if (!userLocation || !preferences) {
      return res.status(400).json({
        error: 'Missing required fields: userLocation, preferences'
      });
    }

    const { latitude, longitude } = userLocation;
    if (!latitude || !longitude) {
      return res.status(400).json({
        error: 'Invalid userLocation: missing latitude or longitude'
      });
    }

    // Get nearby places first
    const nearbyPlaces = await placesService.getNearbyPlaces(
      latitude,
      longitude,
      radius,
      preferences
    );

    // Generate recommendations
    const recommendations = await recommendationService.generateRecommendations(
      preferences,
      nearbyPlaces,
      userLocation
    );

    res.json({
      success: true,
      data: recommendations,
      meta: {
        userLocation,
        preferences,
        radius,
        totalPlaces: nearbyPlaces.length
      }
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({
      error: 'Failed to generate recommendations',
      message: error.message
    });
  }
});

// POST /api/recommendations/itinerary - Generate itinerary from recommendations
router.post('/itinerary', async (req, res) => {
  try {
    const {
      places,
      userLocation,
      preferences
    } = req.body;

    if (!places || !Array.isArray(places) || places.length === 0) {
      return res.status(400).json({
        error: 'Missing or invalid places array'
      });
    }

    const itinerary = recommendationService.generateItinerary(places, preferences);

    res.json({
      success: true,
      data: itinerary,
      meta: {
        placeCount: places.length,
        userLocation
      }
    });
  } catch (error) {
    console.error('Error generating itinerary:', error);
    res.status(500).json({
      error: 'Failed to generate itinerary',
      message: error.message
    });
  }
});

// POST /api/recommendations/surprise-me - Generate surprise recommendations
router.post('/surprise-me', async (req, res) => {
  try {
    const {
      userLocation,
      preferences,
      radius = 1000
    } = req.body;

    if (!userLocation || !preferences) {
      return res.status(400).json({
        error: 'Missing required fields: userLocation, preferences'
      });
    }

    const { latitude, longitude } = userLocation;
    const nearbyPlaces = await placesService.getNearbyPlaces(
      latitude,
      longitude,
      radius,
      preferences
    );

    const surpriseRecommendations = recommendationService.generateSurpriseRecommendations(
      nearbyPlaces,
      preferences
    );

    res.json({
      success: true,
      data: surpriseRecommendations,
      meta: {
        userLocation,
        preferences,
        radius
      }
    });
  } catch (error) {
    console.error('Error generating surprise recommendations:', error);
    res.status(500).json({
      error: 'Failed to generate surprise recommendations',
      message: error.message
    });
  }
});

// GET /api/recommendations/mood-profiles - Get available mood profiles
router.get('/mood-profiles', async (req, res) => {
  try {
    const moodProfiles = [
      {
        id: 'happy',
        name: 'Happy',
        emoji: '😊',
        description: 'Feeling joyful and energetic',
        preferences: ['Restaurant', 'Cafe', 'Park', 'Entertainment'],
        energyLevel: 'high'
      },
      {
        id: 'tired',
        name: 'Tired',
        emoji: '😴',
        description: 'Need rest and relaxation',
        preferences: ['Cafe', 'Park', 'Spa', 'Hotel'],
        energyLevel: 'low'
      },
      {
        id: 'calm',
        name: 'Calm',
        emoji: '🌸',
        description: 'Seeking peace and tranquility',
        preferences: ['Park', 'Cafe', 'Temple', 'Library'],
        energyLevel: 'low'
      },
      {
        id: 'romantic',
        name: 'Romantic',
        emoji: '😍',
        description: 'Looking for intimate experiences',
        preferences: ['Restaurant', 'Cafe', 'Park', 'Bar'],
        energyLevel: 'medium'
      },
      {
        id: 'sad',
        name: 'Sad',
        emoji: '😔',
        description: 'Need comfort and healing',
        preferences: ['Park', 'Cafe', 'Temple', 'Restaurant'],
        energyLevel: 'low'
      },
      {
        id: 'excited',
        name: 'Excited',
        emoji: '🤩',
        description: 'Ready for adventure and fun',
        preferences: ['Entertainment', 'Bar', 'Restaurant', 'Park'],
        energyLevel: 'high'
      }
    ];

    res.json({
      success: true,
      data: moodProfiles
    });
  } catch (error) {
    console.error('Error getting mood profiles:', error);
    res.status(500).json({
      error: 'Failed to get mood profiles',
      message: error.message
    });
  }
});

// GET /api/recommendations/interest-mappings - Get interest to category mappings
router.get('/interest-mappings', async (req, res) => {
  try {
    const interestMappings = {
      'eat': {
        name: 'Eat',
        icon: '🍽️',
        categories: ['Restaurant', 'Cafe', 'Bar', 'Fast Food'],
        weight: 1.0
      },
      'relax': {
        name: 'Relax',
        icon: '🧘',
        categories: ['Cafe', 'Park', 'Spa', 'Hotel'],
        weight: 0.8
      },
      'play': {
        name: 'Play',
        icon: '🎮',
        categories: ['Playground', 'Park', 'Entertainment', 'Gym'],
        weight: 1.2
      },
      'sightseeing': {
        name: 'Sightseeing',
        icon: '📸',
        categories: ['Attraction', 'Museum', 'Park', 'Temple'],
        weight: 1.1
      },
      'nature': {
        name: 'Nature',
        icon: '🌳',
        categories: ['Park', 'Zoo', 'Garden', 'Trail'],
        weight: 0.9
      },
      'sports': {
        name: 'Sports',
        icon: '⚽',
        categories: ['Gym', 'Stadium', 'Park', 'Sports Center'],
        weight: 1.3
      },
      'events': {
        name: 'Events',
        icon: '🎉',
        categories: ['Bar', 'Entertainment', 'Concert Hall', 'Theater'],
        weight: 1.4
      }
    };

    res.json({
      success: true,
      data: interestMappings
    });
  } catch (error) {
    console.error('Error getting interest mappings:', error);
    res.status(500).json({
      error: 'Failed to get interest mappings',
      message: error.message
    });
  }
});

// POST /api/recommendations/score - Calculate recommendation score for a place
router.post('/score', async (req, res) => {
  try {
    const {
      place,
      preferences,
      userLocation
    } = req.body;

    if (!place || !preferences || !userLocation) {
      return res.status(400).json({
        error: 'Missing required fields: place, preferences, userLocation'
      });
    }

    const score = recommendationService.calculateRecommendationScore(
      place,
      preferences,
      userLocation
    );

    res.json({
      success: true,
      data: {
        place: place.name,
        score: score,
        breakdown: {
          baseScore: place.rating * 10,
          distanceScore: recommendationService.calculateDistanceScore(
            place.distance,
            preferences.energyLevel,
            preferences.transport
          ),
          moodScore: recommendationService.calculateMoodScore(place, preferences.mood),
          interestScore: recommendationService.calculateInterestScore(place, preferences.interests)
        }
      }
    });
  } catch (error) {
    console.error('Error calculating recommendation score:', error);
    res.status(500).json({
      error: 'Failed to calculate recommendation score',
      message: error.message
    });
  }
});

// GET /api/recommendations/time-based - Get time-based recommendations
router.get('/time-based', async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      radius = 1000
    } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        error: 'Missing required fields: latitude, longitude'
      });
    }

    const currentHour = new Date().getHours();
    let timeBasedPreferences = {};

    if (currentHour >= 6 && currentHour < 10) {
      timeBasedPreferences = {
        mood: 'calm',
        interests: ['relax', 'eat'],
        energyLevel: 40,
        description: 'Morning recommendations'
      };
    } else if (currentHour >= 10 && currentHour < 14) {
      timeBasedPreferences = {
        mood: 'happy',
        interests: ['eat', 'sightseeing'],
        energyLevel: 70,
        description: 'Lunch time recommendations'
      };
    } else if (currentHour >= 14 && currentHour < 18) {
      timeBasedPreferences = {
        mood: 'calm',
        interests: ['relax', 'nature'],
        energyLevel: 50,
        description: 'Afternoon recommendations'
      };
    } else if (currentHour >= 18 && currentHour < 22) {
      timeBasedPreferences = {
        mood: 'romantic',
        interests: ['eat', 'relax'],
        energyLevel: 60,
        description: 'Evening recommendations'
      };
    } else {
      timeBasedPreferences = {
        mood: 'excited',
        interests: ['events', 'play'],
        energyLevel: 80,
        description: 'Night recommendations'
      };
    }

    const nearbyPlaces = await placesService.getNearbyPlaces(
      parseFloat(latitude),
      parseFloat(longitude),
      parseInt(radius),
      timeBasedPreferences
    );

    const recommendations = await recommendationService.generateRecommendations(
      timeBasedPreferences,
      nearbyPlaces,
      { latitude: parseFloat(latitude), longitude: parseFloat(longitude) }
    );

    res.json({
      success: true,
      data: {
        recommendations: recommendations.topRecommendations.slice(0, 5),
        timeBasedPreferences,
        currentHour
      }
    });
  } catch (error) {
    console.error('Error getting time-based recommendations:', error);
    res.status(500).json({
      error: 'Failed to get time-based recommendations',
      message: error.message
    });
  }
});

module.exports = router;
