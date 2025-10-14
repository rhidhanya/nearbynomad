const axios = require('axios');

class UberService {
  constructor() {
    this.clientId = process.env.UBER_CLIENT_ID;
    this.clientSecret = process.env.UBER_CLIENT_SECRET;
    this.baseUrl = 'https://api.uber.com/v1.2';
  }

  /**
   * Generate Uber deep link for ride request
   * @param {object} pickupLocation - Pickup location {latitude, longitude, address}
   * @param {object} destinationLocation - Destination location {latitude, longitude, address}
   * @param {object} options - Additional options
   */
  async generateRideDeepLink(pickupLocation, destinationLocation, options = {}) {
    try {
      const {
        productId = null,
        surgeConfirmationId = null,
        paymentProfileId = null,
        dropoffNickname = null,
        pickupNickname = null
      } = options;

      // Validate locations
      if (!this.validateLocation(pickupLocation) || !this.validateLocation(destinationLocation)) {
        throw new Error('Invalid location data');
      }

      // Generate deep link URL
      const deepLinkUrl = this.buildDeepLinkUrl({
        pickupLocation,
        destinationLocation,
        productId,
        surgeConfirmationId,
        paymentProfileId,
        dropoffNickname,
        pickupNickname
      });

      // Generate web fallback URL
      const webUrl = this.buildWebUrl({
        pickupLocation,
        destinationLocation
      });

      return {
        deepLink: deepLinkUrl,
        webUrl: webUrl,
        pickupLocation,
        destinationLocation,
        estimatedFare: await this.getEstimatedFare(pickupLocation, destinationLocation),
        estimatedTime: await this.getEstimatedTime(pickupLocation, destinationLocation)
      };
    } catch (error) {
      console.error('Error generating Uber deep link:', error);
      throw error;
    }
  }

  /**
   * Generate Uber deep link for destination only (current location pickup)
   * @param {object} destinationLocation - Destination location
   * @param {object} options - Additional options
   */
  async generateDestinationDeepLink(destinationLocation, options = {}) {
    try {
      if (!this.validateLocation(destinationLocation)) {
        throw new Error('Invalid destination location');
      }

      const deepLinkUrl = this.buildDestinationDeepLinkUrl(destinationLocation, options);
      const webUrl = this.buildDestinationWebUrl(destinationLocation);

      return {
        deepLink: deepLinkUrl,
        webUrl: webUrl,
        destinationLocation,
        estimatedFare: await this.getEstimatedFare(null, destinationLocation),
        estimatedTime: await this.getEstimatedTime(null, destinationLocation)
      };
    } catch (error) {
      console.error('Error generating destination deep link:', error);
      throw error;
    }
  }

  /**
   * Get available Uber products at a location
   * @param {object} location - Location {latitude, longitude}
   */
  async getAvailableProducts(location) {
    try {
      if (!this.clientId) {
        // Return mock data if no API key
        return this.getMockProducts();
      }

      const url = `${this.baseUrl}/products`;
      const params = {
        latitude: location.latitude,
        longitude: location.longitude
      };

      const response = await axios.get(url, {
        params,
        headers: {
          'Authorization': `Bearer ${this.clientId}`,
          'Accept-Language': 'en_US',
          'Content-Type': 'application/json'
        }
      });

      return response.data.products.map(product => ({
        id: product.product_id,
        name: product.display_name,
        description: product.description,
        capacity: product.capacity,
        image: product.image,
        shared: product.shared
      }));
    } catch (error) {
      console.error('Error getting Uber products:', error);
      return this.getMockProducts();
    }
  }

  /**
   * Get estimated fare for a ride
   * @param {object} pickupLocation - Pickup location
   * @param {object} destinationLocation - Destination location
   */
  async getEstimatedFare(pickupLocation, destinationLocation) {
    try {
      if (!this.clientId) {
        return this.getMockFare(pickupLocation, destinationLocation);
      }

      const url = `${this.baseUrl}/estimates/price`;
      const params = {
        start_latitude: pickupLocation?.latitude,
        start_longitude: pickupLocation?.longitude,
        end_latitude: destinationLocation.latitude,
        end_longitude: destinationLocation.longitude
      };

      const response = await axios.get(url, {
        params,
        headers: {
          'Authorization': `Bearer ${this.clientId}`,
          'Accept-Language': 'en_US',
          'Content-Type': 'application/json'
        }
      });

      return response.data.prices.map(price => ({
        productId: price.product_id,
        currencyCode: price.currency_code,
        displayName: price.display_name,
        estimate: price.estimate,
        lowEstimate: price.low_estimate,
        highEstimate: price.high_estimate,
        surgeMultiplier: price.surge_multiplier,
        duration: price.duration
      }));
    } catch (error) {
      console.error('Error getting fare estimate:', error);
      return this.getMockFare(pickupLocation, destinationLocation);
    }
  }

  /**
   * Get estimated time for pickup
   * @param {object} pickupLocation - Pickup location
   * @param {object} destinationLocation - Destination location
   */
  async getEstimatedTime(pickupLocation, destinationLocation) {
    try {
      if (!this.clientId) {
        return this.getMockTime(pickupLocation, destinationLocation);
      }

      const url = `${this.baseUrl}/estimates/time`;
      const params = {
        start_latitude: pickupLocation?.latitude,
        start_longitude: pickupLocation?.longitude,
        end_latitude: destinationLocation.latitude,
        end_longitude: destinationLocation.longitude
      };

      const response = await axios.get(url, {
        params,
        headers: {
          'Authorization': `Bearer ${this.clientId}`,
          'Accept-Language': 'en_US',
          'Content-Type': 'application/json'
        }
      });

      return response.data.times.map(time => ({
        productId: time.product_id,
        estimate: time.estimate,
        displayName: time.display_name
      }));
    } catch (error) {
      console.error('Error getting time estimate:', error);
      return this.getMockTime(pickupLocation, destinationLocation);
    }
  }

  /**
   * Build deep link URL for ride request
   */
  buildDeepLinkUrl(options) {
    const {
      pickupLocation,
      destinationLocation,
      productId,
      surgeConfirmationId,
      paymentProfileId,
      dropoffNickname,
      pickupNickname
    } = options;

    let url = 'uber://';
    
    if (productId) {
      url += `?action=setPickup&pickup[latitude]=${pickupLocation.latitude}&pickup[longitude]=${pickupLocation.longitude}`;
      if (pickupNickname) url += `&pickup[nickname]=${encodeURIComponent(pickupNickname)}`;
      
      url += `&dropoff[latitude]=${destinationLocation.latitude}&dropoff[longitude]=${destinationLocation.longitude}`;
      if (dropoffNickname) url += `&dropoff[nickname]=${encodeURIComponent(dropoffNickname)}`;
      
      url += `&product_id=${productId}`;
      
      if (surgeConfirmationId) url += `&surge_confirmation_id=${surgeConfirmationId}`;
      if (paymentProfileId) url += `&payment_profile_id=${paymentProfileId}`;
    } else {
      // Simple pickup and dropoff
      url += `?action=setPickup&pickup[latitude]=${pickupLocation.latitude}&pickup[longitude]=${pickupLocation.longitude}`;
      url += `&dropoff[latitude]=${destinationLocation.latitude}&dropoff[longitude]=${destinationLocation.longitude}`;
    }

    return url;
  }

  /**
   * Build web URL for ride request
   */
  buildWebUrl(options) {
    const { pickupLocation, destinationLocation } = options;
    
    let url = 'https://m.uber.com/ul/?';
    url += `pickup[latitude]=${pickupLocation.latitude}&pickup[longitude]=${pickupLocation.longitude}`;
    url += `&dropoff[latitude]=${destinationLocation.latitude}&dropoff[longitude]=${destinationLocation.longitude}`;
    
    return url;
  }

  /**
   * Build destination-only deep link URL
   */
  buildDestinationDeepLinkUrl(destinationLocation, options) {
    const { productId } = options;
    
    let url = 'uber://';
    url += `?action=setDropoff&dropoff[latitude]=${destinationLocation.latitude}&dropoff[longitude]=${destinationLocation.longitude}`;
    
    if (productId) {
      url += `&product_id=${productId}`;
    }
    
    return url;
  }

  /**
   * Build destination-only web URL
   */
  buildDestinationWebUrl(destinationLocation) {
    return `https://m.uber.com/ul/?dropoff[latitude]=${destinationLocation.latitude}&dropoff[longitude]=${destinationLocation.longitude}`;
  }

  /**
   * Validate location object
   */
  validateLocation(location) {
    return (
      location &&
      typeof location.latitude === 'number' &&
      typeof location.longitude === 'number' &&
      location.latitude >= -90 &&
      location.latitude <= 90 &&
      location.longitude >= -180 &&
      location.longitude <= 180
    );
  }

  /**
   * Get mock products for demo purposes
   */
  getMockProducts() {
    return [
      {
        id: 'uberx',
        name: 'UberX',
        description: 'Affordable rides for everyday',
        capacity: 4,
        image: 'https://d1a3f4spazzrp4.cloudfront.net/car-types/mono/mono-uberx.png',
        shared: false
      },
      {
        id: 'uberxl',
        name: 'UberXL',
        description: 'Larger vehicles for groups',
        capacity: 6,
        image: 'https://d1a3f4spazzrp4.cloudfront.net/car-types/mono/mono-uberxl.png',
        shared: false
      },
      {
        id: 'uberpool',
        name: 'UberPool',
        description: 'Share your ride, save money',
        capacity: 2,
        image: 'https://d1a3f4spazzrp4.cloudfront.net/car-types/mono/mono-pool.png',
        shared: true
      },
      {
        id: 'uberblack',
        name: 'UberBlack',
        description: 'Premium rides in luxury vehicles',
        capacity: 4,
        image: 'https://d1a3f4spazzrp4.cloudfront.net/car-types/mono/mono-black.png',
        shared: false
      }
    ];
  }

  /**
   * Get mock fare estimate
   */
  getMockFare(pickupLocation, destinationLocation) {
    // Calculate mock fare based on distance
    const distance = this.calculateDistance(pickupLocation, destinationLocation);
    const baseFare = Math.max(5, distance * 0.5); // $0.50 per km, minimum $5

    return [
      {
        productId: 'uberx',
        currencyCode: 'USD',
        displayName: 'UberX',
        estimate: `$${Math.round(baseFare)}-${Math.round(baseFare * 1.3)}`,
        lowEstimate: Math.round(baseFare),
        highEstimate: Math.round(baseFare * 1.3),
        surgeMultiplier: 1.0,
        duration: Math.round(distance * 2) // Rough estimate: 2 minutes per km
      },
      {
        productId: 'uberxl',
        currencyCode: 'USD',
        displayName: 'UberXL',
        estimate: `$${Math.round(baseFare * 1.5)}-${Math.round(baseFare * 1.8)}`,
        lowEstimate: Math.round(baseFare * 1.5),
        highEstimate: Math.round(baseFare * 1.8),
        surgeMultiplier: 1.0,
        duration: Math.round(distance * 2)
      },
      {
        productId: 'uberpool',
        currencyCode: 'USD',
        displayName: 'UberPool',
        estimate: `$${Math.round(baseFare * 0.7)}-${Math.round(baseFare * 0.9)}`,
        lowEstimate: Math.round(baseFare * 0.7),
        highEstimate: Math.round(baseFare * 0.9),
        surgeMultiplier: 1.0,
        duration: Math.round(distance * 2.5) // Pool takes longer
      },
      {
        productId: 'uberblack',
        currencyCode: 'USD',
        displayName: 'UberBlack',
        estimate: `$${Math.round(baseFare * 2.5)}-${Math.round(baseFare * 3)}`,
        lowEstimate: Math.round(baseFare * 2.5),
        highEstimate: Math.round(baseFare * 3),
        surgeMultiplier: 1.0,
        duration: Math.round(distance * 2)
      }
    ];
  }

  /**
   * Get mock time estimate
   */
  getMockTime(pickupLocation, destinationLocation) {
    const distance = this.calculateDistance(pickupLocation, destinationLocation);
    const baseTime = Math.max(5, distance * 1.5); // Rough estimate

    return [
      {
        productId: 'uberx',
        estimate: Math.round(baseTime),
        displayName: 'UberX'
      },
      {
        productId: 'uberxl',
        estimate: Math.round(baseTime * 1.1),
        displayName: 'UberXL'
      },
      {
        productId: 'uberpool',
        estimate: Math.round(baseTime * 1.3),
        displayName: 'UberPool'
      },
      {
        productId: 'uberblack',
        estimate: Math.round(baseTime * 0.9),
        displayName: 'UberBlack'
      }
    ];
  }

  /**
   * Calculate distance between two points (simplified)
   */
  calculateDistance(point1, point2) {
    if (!point1 || !point2) return 5; // Default 5km if no pickup location

    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(point2.latitude - point1.latitude);
    const dLon = this.toRad(point2.longitude - point1.longitude);
    const lat1 = this.toRad(point1.latitude);
    const lat2 = this.toRad(point2.latitude);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    return distance;
  }

  /**
   * Convert degrees to radians
   */
  toRad(deg) {
    return deg * (Math.PI/180);
  }

  /**
   * Generate ride request for a place recommendation
   * @param {object} place - Place object with location
   * @param {object} userLocation - User's current location
   * @param {object} options - Additional options
   */
  async generateRideForPlace(place, userLocation, options = {}) {
    try {
      const pickupLocation = {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        address: userLocation.address || 'Current Location'
      };

      const destinationLocation = {
        latitude: place.latitude,
        longitude: place.longitude,
        address: place.address || place.name
      };

      return await this.generateRideDeepLink(pickupLocation, destinationLocation, options);
    } catch (error) {
      console.error('Error generating ride for place:', error);
      throw error;
    }
  }

  /**
   * Generate multiple ride options for itinerary
   * @param {array} places - Array of places in itinerary
   * @param {object} userLocation - User's starting location
   */
  async generateItineraryRides(places, userLocation) {
    try {
      const rides = [];
      
      // Generate ride from user location to first place
      if (places.length > 0) {
        const firstRide = await this.generateRideForPlace(places[0], userLocation);
        rides.push({
          from: 'Your Location',
          to: places[0].name,
          ride: firstRide
        });
      }

      // Generate rides between places
      for (let i = 0; i < places.length - 1; i++) {
        const currentPlace = places[i];
        const nextPlace = places[i + 1];
        
        const ride = await this.generateRideDeepLink(
          {
            latitude: currentPlace.latitude,
            longitude: currentPlace.longitude,
            address: currentPlace.name
          },
          {
            latitude: nextPlace.latitude,
            longitude: nextPlace.longitude,
            address: nextPlace.name
          }
        );

        rides.push({
          from: currentPlace.name,
          to: nextPlace.name,
          ride: ride
        });
      }

      return rides;
    } catch (error) {
      console.error('Error generating itinerary rides:', error);
      throw error;
    }
  }
}

module.exports = new UberService();
