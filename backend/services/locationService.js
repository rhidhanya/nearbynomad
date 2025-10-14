const geolib = require('geolib');
const { v4: uuidv4 } = require('uuid');

// In-memory storage for demo (in production, use Redis or database)
const userLocations = new Map();
const locationHistory = new Map();

class LocationService {
  /**
   * Update user's current location
   * @param {string} userId - User identifier
   * @param {number} latitude - Latitude coordinate
   * @param {number} longitude - Longitude coordinate
   * @param {object} metadata - Additional location metadata
   */
  async updateUserLocation(userId, latitude, longitude, metadata = {}) {
    try {
      const locationData = {
        userId,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        timestamp: new Date().toISOString(),
        accuracy: metadata.accuracy || null,
        altitude: metadata.altitude || null,
        heading: metadata.heading || null,
        speed: metadata.speed || null,
        address: metadata.address || null
      };

      // Store current location
      userLocations.set(userId, locationData);

      // Store in history (keep last 50 locations per user)
      if (!locationHistory.has(userId)) {
        locationHistory.set(userId, []);
      }
      
      const history = locationHistory.get(userId);
      history.push(locationData);
      
      // Keep only last 50 locations
      if (history.length > 50) {
        history.shift();
      }

      console.log(`Location updated for user ${userId}: ${latitude}, ${longitude}`);
      return locationData;
    } catch (error) {
      console.error('Error updating user location:', error);
      throw error;
    }
  }

  /**
   * Get user's current location
   * @param {string} userId - User identifier
   */
  async getUserLocation(userId) {
    return userLocations.get(userId) || null;
  }

  /**
   * Get user's location history
   * @param {string} userId - User identifier
   * @param {number} limit - Number of recent locations to return
   */
  async getUserLocationHistory(userId, limit = 10) {
    const history = locationHistory.get(userId) || [];
    return history.slice(-limit);
  }

  /**
   * Calculate distance between two points
   * @param {object} point1 - First point {latitude, longitude}
   * @param {object} point2 - Second point {latitude, longitude}
   * @param {string} unit - Unit of measurement ('km', 'm', 'mi')
   */
  calculateDistance(point1, point2, unit = 'km') {
    return geolib.getDistance(point1, point2, unit);
  }

  /**
   * Check if user is within radius of a point
   * @param {string} userId - User identifier
   * @param {object} targetPoint - Target point {latitude, longitude}
   * @param {number} radius - Radius in meters
   */
  async isUserWithinRadius(userId, targetPoint, radius) {
    const userLocation = await this.getUserLocation(userId);
    if (!userLocation) return false;

    const distance = this.calculateDistance(
      { latitude: userLocation.latitude, longitude: userLocation.longitude },
      targetPoint,
      'm'
    );

    return distance <= radius;
  }

  /**
   * Get nearby users within radius
   * @param {string} userId - User identifier
   * @param {number} radius - Radius in meters
   */
  async getNearbyUsers(userId, radius = 1000) {
    const userLocation = await this.getUserLocation(userId);
    if (!userLocation) return [];

    const nearbyUsers = [];
    
    for (const [otherUserId, location] of userLocations) {
      if (otherUserId === userId) continue;

      const distance = this.calculateDistance(
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
        { latitude: location.latitude, longitude: location.longitude },
        'm'
      );

      if (distance <= radius) {
        nearbyUsers.push({
          userId: otherUserId,
          distance,
          location: {
            latitude: location.latitude,
            longitude: location.longitude
          }
        });
      }
    }

    return nearbyUsers.sort((a, b) => a.distance - b.distance);
  }

  /**
   * Calculate user's movement speed
   * @param {string} userId - User identifier
   */
  async getUserSpeed(userId) {
    const history = await this.getUserLocationHistory(userId, 2);
    if (history.length < 2) return 0;

    const [previous, current] = history;
    const distance = this.calculateDistance(
      { latitude: previous.latitude, longitude: previous.longitude },
      { latitude: current.latitude, longitude: current.longitude },
      'm'
    );

    const timeDiff = (new Date(current.timestamp) - new Date(previous.timestamp)) / 1000; // seconds
    return timeDiff > 0 ? distance / timeDiff : 0; // m/s
  }

  /**
   * Detect if user is stationary
   * @param {string} userId - User identifier
   * @param {number} threshold - Movement threshold in meters
   */
  async isUserStationary(userId, threshold = 10) {
    const history = await this.getUserLocationHistory(userId, 5);
    if (history.length < 2) return true;

    const recentLocations = history.slice(-3);
    for (let i = 1; i < recentLocations.length; i++) {
      const distance = this.calculateDistance(
        { latitude: recentLocations[i-1].latitude, longitude: recentLocations[i-1].longitude },
        { latitude: recentLocations[i].latitude, longitude: recentLocations[i].longitude },
        'm'
      );
      
      if (distance > threshold) return false;
    }

    return true;
  }

  /**
   * Get location-based recommendations radius based on energy level
   * @param {number} energyLevel - Energy level (0-100)
   */
  getRecommendationRadius(energyLevel) {
    if (energyLevel < 33) return 500; // Lazy - 500m radius
    if (energyLevel < 66) return 2000; // Moderate - 2km radius
    return 10000; // Adventurous - 10km radius
  }

  /**
   * Validate location coordinates
   * @param {number} latitude - Latitude
   * @param {number} longitude - Longitude
   */
  validateCoordinates(latitude, longitude) {
    return (
      typeof latitude === 'number' &&
      typeof longitude === 'number' &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    );
  }

  /**
   * Generate a unique session ID for location tracking
   */
  generateSessionId() {
    return uuidv4();
  }

  /**
   * Get all active users (users with recent location updates)
   * @param {number} maxAge - Maximum age of location in minutes
   */
  async getActiveUsers(maxAge = 30) {
    const activeUsers = [];
    const cutoffTime = new Date(Date.now() - maxAge * 60 * 1000);

    for (const [userId, location] of userLocations) {
      if (new Date(location.timestamp) > cutoffTime) {
        activeUsers.push({
          userId,
          location: {
            latitude: location.latitude,
            longitude: location.longitude
          },
          lastSeen: location.timestamp
        });
      }
    }

    return activeUsers;
  }
}

module.exports = new LocationService();
