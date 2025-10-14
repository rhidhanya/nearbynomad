const express = require('express');
const router = express.Router();
const uberService = require('../services/uberService');

// POST /api/uber/ride - Generate Uber ride deep link
router.post('/ride', async (req, res) => {
  try {
    const {
      pickupLocation,
      destinationLocation,
      options = {}
    } = req.body;

    // Validate required fields
    if (!pickupLocation || !destinationLocation) {
      return res.status(400).json({
        error: 'Missing required fields: pickupLocation, destinationLocation'
      });
    }

    const rideInfo = await uberService.generateRideDeepLink(
      pickupLocation,
      destinationLocation,
      options
    );

    res.json({
      success: true,
      data: rideInfo
    });
  } catch (error) {
    console.error('Error generating Uber ride:', error);
    res.status(500).json({
      error: 'Failed to generate Uber ride',
      message: error.message
    });
  }
});

// POST /api/uber/destination - Generate Uber destination deep link (from current location)
router.post('/destination', async (req, res) => {
  try {
    const {
      destinationLocation,
      options = {}
    } = req.body;

    if (!destinationLocation) {
      return res.status(400).json({
        error: 'Missing required field: destinationLocation'
      });
    }

    const rideInfo = await uberService.generateDestinationDeepLink(
      destinationLocation,
      options
    );

    res.json({
      success: true,
      data: rideInfo
    });
  } catch (error) {
    console.error('Error generating destination ride:', error);
    res.status(500).json({
      error: 'Failed to generate destination ride',
      message: error.message
    });
  }
});

// POST /api/uber/place-ride - Generate Uber ride to a specific place
router.post('/place-ride', async (req, res) => {
  try {
    const {
      place,
      userLocation,
      options = {}
    } = req.body;

    if (!place || !userLocation) {
      return res.status(400).json({
        error: 'Missing required fields: place, userLocation'
      });
    }

    const rideInfo = await uberService.generateRideForPlace(
      place,
      userLocation,
      options
    );

    res.json({
      success: true,
      data: rideInfo
    });
  } catch (error) {
    console.error('Error generating place ride:', error);
    res.status(500).json({
      error: 'Failed to generate place ride',
      message: error.message
    });
  }
});

// POST /api/uber/itinerary-rides - Generate Uber rides for an itinerary
router.post('/itinerary-rides', async (req, res) => {
  try {
    const {
      places,
      userLocation
    } = req.body;

    if (!places || !Array.isArray(places) || places.length === 0 || !userLocation) {
      return res.status(400).json({
        error: 'Missing required fields: places (array), userLocation'
      });
    }

    const rides = await uberService.generateItineraryRides(places, userLocation);

    res.json({
      success: true,
      data: rides,
      meta: {
        placeCount: places.length,
        rideCount: rides.length
      }
    });
  } catch (error) {
    console.error('Error generating itinerary rides:', error);
    res.status(500).json({
      error: 'Failed to generate itinerary rides',
      message: error.message
    });
  }
});

// GET /api/uber/products - Get available Uber products at a location
router.get('/products', async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        error: 'Missing required fields: latitude, longitude'
      });
    }

    const products = await uberService.getAvailableProducts({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    });

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error getting Uber products:', error);
    res.status(500).json({
      error: 'Failed to get Uber products',
      message: error.message
    });
  }
});

// GET /api/uber/fare-estimate - Get fare estimate for a ride
router.get('/fare-estimate', async (req, res) => {
  try {
    const {
      pickupLatitude,
      pickupLongitude,
      destinationLatitude,
      destinationLongitude
    } = req.query;

    if (!pickupLatitude || !pickupLongitude || !destinationLatitude || !destinationLongitude) {
      return res.status(400).json({
        error: 'Missing required fields: pickupLatitude, pickupLongitude, destinationLatitude, destinationLongitude'
      });
    }

    const pickupLocation = {
      latitude: parseFloat(pickupLatitude),
      longitude: parseFloat(pickupLongitude)
    };

    const destinationLocation = {
      latitude: parseFloat(destinationLatitude),
      longitude: parseFloat(destinationLongitude)
    };

    const fareEstimate = await uberService.getEstimatedFare(
      pickupLocation,
      destinationLocation
    );

    res.json({
      success: true,
      data: fareEstimate
    });
  } catch (error) {
    console.error('Error getting fare estimate:', error);
    res.status(500).json({
      error: 'Failed to get fare estimate',
      message: error.message
    });
  }
});

// GET /api/uber/time-estimate - Get time estimate for pickup
router.get('/time-estimate', async (req, res) => {
  try {
    const {
      pickupLatitude,
      pickupLongitude,
      destinationLatitude,
      destinationLongitude
    } = req.query;

    if (!pickupLatitude || !pickupLongitude || !destinationLatitude || !destinationLongitude) {
      return res.status(400).json({
        error: 'Missing required fields: pickupLatitude, pickupLongitude, destinationLatitude, destinationLongitude'
      });
    }

    const pickupLocation = {
      latitude: parseFloat(pickupLatitude),
      longitude: parseFloat(pickupLongitude)
    };

    const destinationLocation = {
      latitude: parseFloat(destinationLatitude),
      longitude: parseFloat(destinationLongitude)
    };

    const timeEstimate = await uberService.getEstimatedTime(
      pickupLocation,
      destinationLocation
    );

    res.json({
      success: true,
      data: timeEstimate
    });
  } catch (error) {
    console.error('Error getting time estimate:', error);
    res.status(500).json({
      error: 'Failed to get time estimate',
      message: error.message
    });
  }
});

// GET /api/uber/distance - Calculate distance between two points
router.get('/distance', async (req, res) => {
  try {
    const {
      pickupLatitude,
      pickupLongitude,
      destinationLatitude,
      destinationLongitude
    } = req.query;

    if (!pickupLatitude || !pickupLongitude || !destinationLatitude || !destinationLongitude) {
      return res.status(400).json({
        error: 'Missing required fields: pickupLatitude, pickupLongitude, destinationLatitude, destinationLongitude'
      });
    }

    const pickupLocation = {
      latitude: parseFloat(pickupLatitude),
      longitude: parseFloat(pickupLongitude)
    };

    const destinationLocation = {
      latitude: parseFloat(destinationLatitude),
      longitude: parseFloat(destinationLongitude)
    };

    const distance = uberService.calculateDistance(pickupLocation, destinationLocation);

    res.json({
      success: true,
      data: {
        distance: distance,
        unit: 'km'
      }
    });
  } catch (error) {
    console.error('Error calculating distance:', error);
    res.status(500).json({
      error: 'Failed to calculate distance',
      message: error.message
    });
  }
});

// GET /api/uber/deep-link-info - Get information about Uber deep links
router.get('/deep-link-info', async (req, res) => {
  try {
    const deepLinkInfo = {
      supportedActions: [
        'setPickup',
        'setDropoff',
        'setPickupAndDropoff'
      ],
      supportedParameters: [
        'pickup[latitude]',
        'pickup[longitude]',
        'pickup[nickname]',
        'dropoff[latitude]',
        'dropoff[longitude]',
        'dropoff[nickname]',
        'product_id',
        'surge_confirmation_id',
        'payment_profile_id'
      ],
      examples: {
        basicRide: 'uber://?action=setPickup&pickup[latitude]=37.7749&pickup[longitude]=-122.4194&dropoff[latitude]=37.7849&dropoff[longitude]=-122.4094',
        destinationOnly: 'uber://?action=setDropoff&dropoff[latitude]=37.7849&dropoff[longitude]=-122.4094',
        withProduct: 'uber://?action=setPickup&pickup[latitude]=37.7749&pickup[longitude]=-122.4194&dropoff[latitude]=37.7849&dropoff[longitude]=-122.4094&product_id=uberx'
      },
      webFallback: 'https://m.uber.com/ul/?pickup[latitude]=37.7749&pickup[longitude]=-122.4194&dropoff[latitude]=37.7849&dropoff[longitude]=-122.4094'
    };

    res.json({
      success: true,
      data: deepLinkInfo
    });
  } catch (error) {
    console.error('Error getting deep link info:', error);
    res.status(500).json({
      error: 'Failed to get deep link info',
      message: error.message
    });
  }
});

module.exports = router;
