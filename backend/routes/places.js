const express = require('express');
const router = express.Router();
const placesService = require('../services/placesService');

// GET /api/places/nearby - Get nearby places
router.get('/nearby', async (req, res) => {
  try {
    const { latitude, longitude, radius = 1000, interests, mood, energyLevel } = req.query;

    // Validate required fields
    if (!latitude || !longitude) {
      return res.status(400).json({
        error: 'Missing required fields: latitude, longitude'
      });
    }

    // Parse parameters
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const searchRadius = parseInt(radius);
    const userInterests = interests ? interests.split(',') : [];
    const userMood = mood || '';
    const userEnergyLevel = parseInt(energyLevel) || 50;

    // Validate coordinates
    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return res.status(400).json({
        error: 'Invalid coordinates'
      });
    }

    const preferences = {
      interests: userInterests,
      mood: userMood,
      energyLevel: userEnergyLevel
    };

    const places = await placesService.getNearbyPlaces(lat, lon, searchRadius, preferences);

    res.json({
      success: true,
      data: places,
      meta: {
        location: { latitude: lat, longitude: lon },
        radius: searchRadius,
        count: places.length
      }
    });
  } catch (error) {
    console.error('Error getting nearby places:', error);
    res.status(500).json({
      error: 'Failed to get nearby places',
      message: error.message
    });
  }
});

// GET /api/places/search - Search places by name
router.get('/search', async (req, res) => {
  try {
    const { query, latitude, longitude } = req.query;

    if (!query) {
      return res.status(400).json({
        error: 'Missing required field: query'
      });
    }

    const lat = latitude ? parseFloat(latitude) : null;
    const lon = longitude ? parseFloat(longitude) : null;

    const places = await placesService.searchPlaces(query, lat, lon);

    res.json({
      success: true,
      data: places,
      meta: {
        query,
        count: places.length
      }
    });
  } catch (error) {
    console.error('Error searching places:', error);
    res.status(500).json({
      error: 'Failed to search places',
      message: error.message
    });
  }
});

// GET /api/places/:placeId - Get place details
router.get('/:placeId', async (req, res) => {
  try {
    const { placeId } = req.params;
    const { source = 'osm' } = req.query;

    const placeDetails = await placesService.getPlaceDetails(placeId, source);

    if (!placeDetails) {
      return res.status(404).json({
        error: 'Place not found'
      });
    }

    res.json({
      success: true,
      data: placeDetails
    });
  } catch (error) {
    console.error('Error getting place details:', error);
    res.status(500).json({
      error: 'Failed to get place details',
      message: error.message
    });
  }
});

// POST /api/places/reverse-geocode - Get address from coordinates
router.post('/reverse-geocode', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        error: 'Missing required fields: latitude, longitude'
      });
    }

    const address = await placesService.getAddressFromCoordinates(latitude, longitude);

    res.json({
      success: true,
      data: address
    });
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    res.status(500).json({
      error: 'Failed to reverse geocode',
      message: error.message
    });
  }
});

// GET /api/places/categories - Get available place categories
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      { id: 'restaurant', name: 'Restaurant', icon: '🍽️' },
      { id: 'cafe', name: 'Cafe', icon: '☕' },
      { id: 'bar', name: 'Bar', icon: '🍻' },
      { id: 'hotel', name: 'Hotel', icon: '🏨' },
      { id: 'attraction', name: 'Attraction', icon: '🎯' },
      { id: 'park', name: 'Park', icon: '🌳' },
      { id: 'playground', name: 'Playground', icon: '🎪' },
      { id: 'temple', name: 'Temple', icon: '🕉️' },
      { id: 'shopping', name: 'Shopping', icon: '🛍️' },
      { id: 'entertainment', name: 'Entertainment', icon: '🎭' },
      { id: 'museum', name: 'Museum', icon: '🏛️' },
      { id: 'gym', name: 'Gym', icon: '💪' },
      { id: 'spa', name: 'Spa', icon: '🧘' },
      { id: 'hospital', name: 'Hospital', icon: '🏥' },
      { id: 'pharmacy', name: 'Pharmacy', icon: '💊' },
      { id: 'bank', name: 'Bank', icon: '🏦' },
      { id: 'atm', name: 'ATM', icon: '💰' }
    ];

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({
      error: 'Failed to get categories',
      message: error.message
    });
  }
});

// GET /api/places/filtered - Get filtered places based on preferences
router.get('/filtered', async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      radius = 1000,
      categories,
      minRating,
      maxPriceLevel,
      wheelchairAccessible,
      petFriendly,
      kidFriendly,
      hasWiFi,
      outdoorSeating
    } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        error: 'Missing required fields: latitude, longitude'
      });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const searchRadius = parseInt(radius);

    // Get all nearby places first
    const allPlaces = await placesService.getNearbyPlaces(lat, lon, searchRadius);

    // Apply filters
    let filteredPlaces = allPlaces;

    if (categories) {
      const categoryList = categories.split(',');
      filteredPlaces = filteredPlaces.filter(place => 
        categoryList.includes(place.category.toLowerCase())
      );
    }

    if (minRating) {
      const minRatingValue = parseFloat(minRating);
      filteredPlaces = filteredPlaces.filter(place => 
        place.rating >= minRatingValue
      );
    }

    if (maxPriceLevel) {
      const maxPrice = parseInt(maxPriceLevel);
      filteredPlaces = filteredPlaces.filter(place => 
        (place.priceLevel || 0) <= maxPrice
      );
    }

    if (wheelchairAccessible === 'true') {
      filteredPlaces = filteredPlaces.filter(place => 
        place.wheelchairAccessible
      );
    }

    if (petFriendly === 'true') {
      filteredPlaces = filteredPlaces.filter(place => 
        place.petFriendly
      );
    }

    if (kidFriendly === 'true') {
      filteredPlaces = filteredPlaces.filter(place => 
        place.kidFriendly
      );
    }

    if (hasWiFi === 'true') {
      filteredPlaces = filteredPlaces.filter(place => 
        place.tags && place.tags.includes('WiFi')
      );
    }

    if (outdoorSeating === 'true') {
      filteredPlaces = filteredPlaces.filter(place => 
        place.tags && place.tags.includes('Outdoor Seating')
      );
    }

    res.json({
      success: true,
      data: filteredPlaces,
      meta: {
        location: { latitude: lat, longitude: lon },
        radius: searchRadius,
        filters: req.query,
        count: filteredPlaces.length,
        totalCount: allPlaces.length
      }
    });
  } catch (error) {
    console.error('Error getting filtered places:', error);
    res.status(500).json({
      error: 'Failed to get filtered places',
      message: error.message
    });
  }
});

module.exports = router;
