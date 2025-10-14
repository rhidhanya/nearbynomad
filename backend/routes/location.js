const express = require('express');
const router = express.Router();
const locationService = require('../services/locationService');

// POST /api/location/update - Update user location
router.post('/update', async (req, res) => {
  try {
    const { userId, latitude, longitude, metadata = {} } = req.body;

    // Validate required fields
    if (!userId || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        error: 'Missing required fields: userId, latitude, longitude'
      });
    }

    // Validate coordinates
    if (!locationService.validateCoordinates(latitude, longitude)) {
      return res.status(400).json({
        error: 'Invalid coordinates'
      });
    }

    // Update location
    const locationData = await locationService.updateUserLocation(
      userId,
      latitude,
      longitude,
      metadata
    );

    res.json({
      success: true,
      data: locationData
    });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({
      error: 'Failed to update location',
      message: error.message
    });
  }
});

// GET /api/location/:userId - Get user's current location
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const location = await locationService.getUserLocation(userId);

    if (!location) {
      return res.status(404).json({
        error: 'Location not found'
      });
    }

    res.json({
      success: true,
      data: location
    });
  } catch (error) {
    console.error('Error getting location:', error);
    res.status(500).json({
      error: 'Failed to get location',
      message: error.message
    });
  }
});

// GET /api/location/:userId/history - Get user's location history
router.get('/:userId/history', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10 } = req.query;

    const history = await locationService.getUserLocationHistory(userId, parseInt(limit));

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Error getting location history:', error);
    res.status(500).json({
      error: 'Failed to get location history',
      message: error.message
    });
  }
});

// GET /api/location/:userId/nearby-users - Get nearby users
router.get('/:userId/nearby-users', async (req, res) => {
  try {
    const { userId } = req.params;
    const { radius = 1000 } = req.query;

    const nearbyUsers = await locationService.getNearbyUsers(userId, parseInt(radius));

    res.json({
      success: true,
      data: nearbyUsers
    });
  } catch (error) {
    console.error('Error getting nearby users:', error);
    res.status(500).json({
      error: 'Failed to get nearby users',
      message: error.message
    });
  }
});

// GET /api/location/:userId/speed - Get user's current speed
router.get('/:userId/speed', async (req, res) => {
  try {
    const { userId } = req.params;
    const speed = await locationService.getUserSpeed(userId);

    res.json({
      success: true,
      data: { speed }
    });
  } catch (error) {
    console.error('Error getting user speed:', error);
    res.status(500).json({
      error: 'Failed to get user speed',
      message: error.message
    });
  }
});

// GET /api/location/:userId/stationary - Check if user is stationary
router.get('/:userId/stationary', async (req, res) => {
  try {
    const { userId } = req.params;
    const { threshold = 10 } = req.query;

    const isStationary = await locationService.isUserStationary(userId, parseInt(threshold));

    res.json({
      success: true,
      data: { isStationary }
    });
  } catch (error) {
    console.error('Error checking if user is stationary:', error);
    res.status(500).json({
      error: 'Failed to check if user is stationary',
      message: error.message
    });
  }
});

// GET /api/location/active-users - Get all active users
router.get('/active-users', async (req, res) => {
  try {
    const { maxAge = 30 } = req.query;
    const activeUsers = await locationService.getActiveUsers(parseInt(maxAge));

    res.json({
      success: true,
      data: activeUsers
    });
  } catch (error) {
    console.error('Error getting active users:', error);
    res.status(500).json({
      error: 'Failed to get active users',
      message: error.message
    });
  }
});

// POST /api/location/within-radius - Check if user is within radius of a point
router.post('/within-radius', async (req, res) => {
  try {
    const { userId, targetPoint, radius } = req.body;

    if (!userId || !targetPoint || !radius) {
      return res.status(400).json({
        error: 'Missing required fields: userId, targetPoint, radius'
      });
    }

    const isWithinRadius = await locationService.isUserWithinRadius(
      userId,
      targetPoint,
      radius
    );

    res.json({
      success: true,
      data: { isWithinRadius }
    });
  } catch (error) {
    console.error('Error checking radius:', error);
    res.status(500).json({
      error: 'Failed to check radius',
      message: error.message
    });
  }
});

// POST /api/location/calculate-distance - Calculate distance between two points
router.post('/calculate-distance', async (req, res) => {
  try {
    const { point1, point2, unit = 'km' } = req.body;

    if (!point1 || !point2) {
      return res.status(400).json({
        error: 'Missing required fields: point1, point2'
      });
    }

    const distance = locationService.calculateDistance(point1, point2, unit);

    res.json({
      success: true,
      data: { distance, unit }
    });
  } catch (error) {
    console.error('Error calculating distance:', error);
    res.status(500).json({
      error: 'Failed to calculate distance',
      message: error.message
    });
  }
});

// GET /api/location/recommendation-radius/:energyLevel - Get recommendation radius for energy level
router.get('/recommendation-radius/:energyLevel', async (req, res) => {
  try {
    const { energyLevel } = req.params;
    const radius = locationService.getRecommendationRadius(parseInt(energyLevel));

    res.json({
      success: true,
      data: { radius, energyLevel: parseInt(energyLevel) }
    });
  } catch (error) {
    console.error('Error getting recommendation radius:', error);
    res.status(500).json({
      error: 'Failed to get recommendation radius',
      message: error.message
    });
  }
});

module.exports = router;
