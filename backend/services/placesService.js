const axios = require('axios');
const NodeGeocoder = require('node-geocoder');

// Initialize geocoder for reverse geocoding
const geocoder = NodeGeocoder({
  provider: 'openstreetmap',
  httpAdapter: 'https',
  formatter: null
});

class PlacesService {
  constructor() {
    this.googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
    this.overpassApiUrl = process.env.OPENSTREETMAP_API_URL || 'https://overpass-api.de/api/interpreter';
    this.nominatimApiUrl = process.env.NOMINATIM_API_URL || 'https://nominatim.openstreetmap.org';
  }

  /**
   * Get places using OpenStreetMap Overpass API
   * @param {number} latitude - Latitude
   * @param {number} longitude - Longitude
   * @param {number} radius - Search radius in meters
   * @param {array} placeTypes - Array of place types to search for
   */
  async getPlacesFromOSM(latitude, longitude, radius = 1000, placeTypes = []) {
    try {
      const defaultPlaceTypes = [
        'amenity=restaurant',
        'amenity=cafe',
        'amenity=bar',
        'amenity=fast_food',
        'tourism=hotel',
        'tourism=attraction',
        'leisure=park',
        'leisure=playground',
        'amenity=place_of_worship',
        'shop=mall',
        'shop=supermarket',
        'amenity=hospital',
        'amenity=pharmacy',
        'amenity=bank',
        'amenity=atm'
      ];

      const searchTypes = placeTypes.length > 0 ? placeTypes : defaultPlaceTypes;
      
      // Build Overpass QL query
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"~"^(restaurant|cafe|bar|fast_food|place_of_worship|hospital|pharmacy|bank|atm)$"](around:${radius},${latitude},${longitude});
          node["tourism"~"^(hotel|attraction)$"](around:${radius},${latitude},${longitude});
          node["leisure"~"^(park|playground)$"](around:${radius},${latitude},${longitude});
          node["shop"~"^(mall|supermarket)$"](around:${radius},${latitude},${longitude});
        );
        out geom;
      `;

      const response = await axios.post(this.overpassApiUrl, query, {
        headers: {
          'Content-Type': 'text/plain'
        },
        timeout: 30000
      });

      return this.formatOSMPlaces(response.data.elements, latitude, longitude);
    } catch (error) {
      console.error('Error fetching places from OSM:', error);
      throw error;
    }
  }

  /**
   * Get places using Google Places API
   * @param {number} latitude - Latitude
   * @param {number} longitude - Longitude
   * @param {number} radius - Search radius in meters
   * @param {string} placeType - Google Places type
   */
  async getPlacesFromGoogle(latitude, longitude, radius = 1000, placeType = 'establishment') {
    try {
      if (!this.googleMapsApiKey) {
        throw new Error('Google Maps API key not configured');
      }

      const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
      const params = {
        location: `${latitude},${longitude}`,
        radius: radius,
        type: placeType,
        key: this.googleMapsApiKey
      };

      const response = await axios.get(url, { params });
      
      if (response.data.status !== 'OK') {
        throw new Error(`Google Places API error: ${response.data.status}`);
      }

      return this.formatGooglePlaces(response.data.results, latitude, longitude);
    } catch (error) {
      console.error('Error fetching places from Google:', error);
      throw error;
    }
  }

  /**
   * Get comprehensive places data combining multiple sources
   * @param {number} latitude - Latitude
   * @param {number} longitude - Longitude
   * @param {number} radius - Search radius in meters
   * @param {object} preferences - User preferences
   */
  async getNearbyPlaces(latitude, longitude, radius = 1000, preferences = {}) {
    try {
      const { interests = [], mood = '', energyLevel = 50 } = preferences;
      
      // Adjust radius based on energy level
      const adjustedRadius = this.getRadiusForEnergyLevel(energyLevel, radius);
      
      // Get places from OSM (free and comprehensive)
      const osmPlaces = await this.getPlacesFromOSM(latitude, longitude, adjustedRadius);
      
      // Get additional places from Google if API key is available
      let googlePlaces = [];
      if (this.googleMapsApiKey) {
        try {
          const googleTypes = this.getGooglePlaceTypes(interests);
          for (const type of googleTypes) {
            const places = await this.getPlacesFromGoogle(latitude, longitude, adjustedRadius, type);
            googlePlaces = googlePlaces.concat(places);
          }
        } catch (error) {
          console.warn('Google Places API failed, continuing with OSM data only');
        }
      }

      // Combine and deduplicate places
      const allPlaces = [...osmPlaces, ...googlePlaces];
      const uniquePlaces = this.deduplicatePlaces(allPlaces);

      // Filter and categorize places based on preferences
      const filteredPlaces = this.filterPlacesByPreferences(uniquePlaces, preferences);

      // Sort by relevance and distance
      const sortedPlaces = this.sortPlacesByRelevance(filteredPlaces, preferences);

      return sortedPlaces.slice(0, 50); // Return top 50 results
    } catch (error) {
      console.error('Error getting nearby places:', error);
      throw error;
    }
  }

  /**
   * Get place details by ID
   * @param {string} placeId - Place identifier
   * @param {string} source - Source of the place ('osm' or 'google')
   */
  async getPlaceDetails(placeId, source = 'osm') {
    try {
      if (source === 'google' && this.googleMapsApiKey) {
        return await this.getGooglePlaceDetails(placeId);
      } else {
        return await this.getOSMPlaceDetails(placeId);
      }
    } catch (error) {
      console.error('Error getting place details:', error);
      throw error;
    }
  }

  /**
   * Search for places by name
   * @param {string} query - Search query
   * @param {number} latitude - Latitude for location bias
   * @param {number} longitude - Longitude for location bias
   */
  async searchPlaces(query, latitude, longitude) {
    try {
      const results = [];
      
      // Search using Nominatim (OpenStreetMap)
      const nominatimResults = await this.searchNominatim(query, latitude, longitude);
      results.push(...nominatimResults);

      // Search using Google if API key is available
      if (this.googleMapsApiKey) {
        try {
          const googleResults = await this.searchGooglePlaces(query, latitude, longitude);
          results.push(...googleResults);
        } catch (error) {
          console.warn('Google Places search failed');
        }
      }

      return this.deduplicatePlaces(results).slice(0, 20);
    } catch (error) {
      console.error('Error searching places:', error);
      throw error;
    }
  }

  /**
   * Get reverse geocoding information
   * @param {number} latitude - Latitude
   * @param {number} longitude - Longitude
   */
  async getAddressFromCoordinates(latitude, longitude) {
    try {
      const results = await geocoder.reverse({ lat: latitude, lon: longitude });
      return results[0] || null;
    } catch (error) {
      console.error('Error getting address from coordinates:', error);
      return null;
    }
  }

  /**
   * Format OSM places data
   */
  formatOSMPlaces(elements, userLat, userLon) {
    return elements.map(element => {
      const distance = this.calculateDistance(
        { latitude: userLat, longitude: userLon },
        { latitude: element.lat, longitude: element.lon }
      );

      return {
        id: `osm_${element.id}`,
        name: element.tags?.name || 'Unnamed Place',
        category: this.categorizeOSMPlace(element.tags),
        latitude: element.lat,
        longitude: element.lon,
        distance: distance,
        rating: this.generateMockRating(),
        priceLevel: this.generateMockPriceLevel(element.tags),
        tags: this.extractOSMTags(element.tags),
        source: 'osm',
        address: element.tags?.['addr:full'] || element.tags?.['addr:street'] || null,
        phone: element.tags?.['phone'] || null,
        website: element.tags?.['website'] || null,
        openingHours: element.tags?.['opening_hours'] || null,
        wheelchairAccessible: element.tags?.['wheelchair'] === 'yes',
        petFriendly: element.tags?.['dog'] === 'yes',
        kidFriendly: element.tags?.['child'] === 'yes'
      };
    });
  }

  /**
   * Format Google Places data
   */
  formatGooglePlaces(results, userLat, userLon) {
    return results.map(place => {
      const distance = this.calculateDistance(
        { latitude: userLat, longitude: userLon },
        { latitude: place.geometry.location.lat, longitude: place.geometry.location.lng }
      );

      return {
        id: `google_${place.place_id}`,
        name: place.name,
        category: this.categorizeGooglePlace(place.types),
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        distance: distance,
        rating: place.rating || this.generateMockRating(),
        priceLevel: place.price_level || this.generateMockPriceLevel(),
        tags: place.types || [],
        source: 'google',
        address: place.vicinity || null,
        phone: null, // Would need additional API call
        website: null, // Would need additional API call
        openingHours: null, // Would need additional API call
        wheelchairAccessible: place.accessibility?.wheelchair_accessible || false,
        petFriendly: false, // Google doesn't provide this info
        kidFriendly: place.types?.includes('amusement_park') || false
      };
    });
  }

  /**
   * Calculate distance between two points
   */
  calculateDistance(point1, point2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = point1.latitude * Math.PI/180;
    const φ2 = point2.latitude * Math.PI/180;
    const Δφ = (point2.latitude - point1.latitude) * Math.PI/180;
    const Δλ = (point2.longitude - point1.longitude) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }

  /**
   * Categorize OSM place based on tags
   */
  categorizeOSMPlace(tags) {
    if (tags?.amenity === 'restaurant') return 'Restaurant';
    if (tags?.amenity === 'cafe') return 'Cafe';
    if (tags?.amenity === 'bar') return 'Bar';
    if (tags?.amenity === 'fast_food') return 'Fast Food';
    if (tags?.tourism === 'hotel') return 'Hotel';
    if (tags?.tourism === 'attraction') return 'Attraction';
    if (tags?.leisure === 'park') return 'Park';
    if (tags?.leisure === 'playground') return 'Playground';
    if (tags?.amenity === 'place_of_worship') return 'Temple';
    if (tags?.shop === 'mall') return 'Shopping';
    if (tags?.shop === 'supermarket') return 'Shopping';
    return 'Other';
  }

  /**
   * Categorize Google place based on types
   */
  categorizeGooglePlace(types) {
    if (types?.includes('restaurant')) return 'Restaurant';
    if (types?.includes('cafe')) return 'Cafe';
    if (types?.includes('bar')) return 'Bar';
    if (types?.includes('lodging')) return 'Hotel';
    if (types?.includes('tourist_attraction')) return 'Attraction';
    if (types?.includes('park')) return 'Park';
    if (types?.includes('shopping_mall')) return 'Shopping';
    if (types?.includes('place_of_worship')) return 'Temple';
    return 'Other';
  }

  /**
   * Extract relevant tags from OSM data
   */
  extractOSMTags(tags) {
    const relevantTags = [];
    if (tags?.cuisine) relevantTags.push(tags.cuisine);
    if (tags?.outdoor_seating === 'yes') relevantTags.push('Outdoor Seating');
    if (tags?.wifi === 'yes') relevantTags.push('WiFi');
    if (tags?.takeaway === 'yes') relevantTags.push('Takeaway');
    if (tags?.delivery === 'yes') relevantTags.push('Delivery');
    return relevantTags;
  }

  /**
   * Generate mock rating for places without ratings
   */
  generateMockRating() {
    return Math.round((Math.random() * 2 + 3) * 10) / 10; // 3.0 to 5.0
  }

  /**
   * Generate mock price level
   */
  generateMockPriceLevel(tags = {}) {
    if (tags?.amenity === 'fast_food') return 1;
    if (tags?.amenity === 'restaurant') return Math.floor(Math.random() * 3) + 2; // 2-4
    return Math.floor(Math.random() * 4) + 1; // 1-4
  }

  /**
   * Get radius based on energy level
   */
  getRadiusForEnergyLevel(energyLevel, baseRadius) {
    if (energyLevel < 33) return Math.min(baseRadius, 500); // Lazy
    if (energyLevel < 66) return Math.min(baseRadius, 2000); // Moderate
    return Math.min(baseRadius, 10000); // Adventurous
  }

  /**
   * Get Google place types based on interests
   */
  getGooglePlaceTypes(interests) {
    const typeMapping = {
      'eat': ['restaurant', 'cafe', 'food'],
      'relax': ['spa', 'park', 'cafe'],
      'play': ['amusement_park', 'park', 'gym'],
      'sightseeing': ['tourist_attraction', 'museum', 'park'],
      'nature': ['park', 'zoo', 'aquarium'],
      'sports': ['gym', 'stadium', 'park'],
      'events': ['night_club', 'bar', 'entertainment']
    };

    const types = new Set();
    interests.forEach(interest => {
      if (typeMapping[interest]) {
        typeMapping[interest].forEach(type => types.add(type));
      }
    });

    return Array.from(types);
  }

  /**
   * Deduplicate places based on name and location
   */
  deduplicatePlaces(places) {
    const seen = new Set();
    return places.filter(place => {
      const key = `${place.name.toLowerCase()}_${place.latitude.toFixed(4)}_${place.longitude.toFixed(4)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  /**
   * Filter places based on user preferences
   */
  filterPlacesByPreferences(places, preferences) {
    const { accessibility = [], budget = 0, transport = '' } = preferences;

    return places.filter(place => {
      // Filter by accessibility
      if (accessibility.includes('wheelchair') && !place.wheelchairAccessible) {
        return false;
      }
      if (accessibility.includes('pet') && !place.petFriendly) {
        return false;
      }
      if (accessibility.includes('kid') && !place.kidFriendly) {
        return false;
      }

      // Filter by budget
      if (budget > 0 && place.priceLevel > this.getMaxPriceLevel(budget)) {
        return false;
      }

      // Filter by transport (distance limits)
      if (transport === 'walk' && place.distance > 1000) {
        return false;
      }
      if (transport === 'bike' && place.distance > 5000) {
        return false;
      }

      return true;
    });
  }

  /**
   * Sort places by relevance
   */
  sortPlacesByRelevance(places, preferences) {
    const { mood = '', interests = [] } = preferences;

    return places.sort((a, b) => {
      // Calculate relevance score
      const scoreA = this.calculateRelevanceScore(a, preferences);
      const scoreB = this.calculateRelevanceScore(b, preferences);

      // Primary sort by relevance score
      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      }

      // Secondary sort by distance
      return a.distance - b.distance;
    });
  }

  /**
   * Calculate relevance score for a place
   */
  calculateRelevanceScore(place, preferences) {
    let score = 0;
    const { mood = '', interests = [] } = preferences;

    // Base score from rating
    score += place.rating * 2;

    // Distance penalty
    score -= place.distance / 1000; // -1 point per km

    // Interest matching
    const interestMapping = {
      'eat': ['Restaurant', 'Cafe', 'Bar', 'Fast Food'],
      'relax': ['Cafe', 'Park', 'Spa'],
      'play': ['Playground', 'Park', 'Gym'],
      'sightseeing': ['Attraction', 'Museum', 'Park'],
      'nature': ['Park', 'Zoo', 'Aquarium'],
      'sports': ['Gym', 'Stadium', 'Park'],
      'events': ['Bar', 'Night Club', 'Entertainment']
    };

    interests.forEach(interest => {
      if (interestMapping[interest]?.includes(place.category)) {
        score += 5;
      }
    });

    // Mood matching
    const moodMapping = {
      'happy': ['Restaurant', 'Cafe', 'Park', 'Entertainment'],
      'tired': ['Cafe', 'Park', 'Spa'],
      'calm': ['Park', 'Cafe', 'Temple'],
      'romantic': ['Restaurant', 'Cafe', 'Park'],
      'sad': ['Park', 'Cafe', 'Temple'],
      'excited': ['Entertainment', 'Bar', 'Amusement Park']
    };

    if (moodMapping[mood]?.includes(place.category)) {
      score += 3;
    }

    return score;
  }

  /**
   * Get max price level based on budget
   */
  getMaxPriceLevel(budget) {
    if (budget < 20) return 1; // Broke mode
    if (budget < 50) return 2; // Budget-friendly
    return 4; // Loaded
  }

  /**
   * Search places using Nominatim
   */
  async searchNominatim(query, latitude, longitude) {
    try {
      const url = `${this.nominatimApiUrl}/search`;
      const params = {
        q: query,
        format: 'json',
        limit: 10,
        lat: latitude,
        lon: longitude,
        zoom: 10
      };

      const response = await axios.get(url, { params });
      return response.data.map(place => ({
        id: `nominatim_${place.place_id}`,
        name: place.display_name.split(',')[0],
        category: 'Search Result',
        latitude: parseFloat(place.lat),
        longitude: parseFloat(place.lon),
        distance: this.calculateDistance(
          { latitude, longitude },
          { latitude: parseFloat(place.lat), longitude: parseFloat(place.lon) }
        ),
        rating: this.generateMockRating(),
        priceLevel: this.generateMockPriceLevel(),
        tags: [],
        source: 'nominatim',
        address: place.display_name,
        phone: null,
        website: null,
        openingHours: null,
        wheelchairAccessible: false,
        petFriendly: false,
        kidFriendly: false
      }));
    } catch (error) {
      console.error('Error searching Nominatim:', error);
      return [];
    }
  }

  /**
   * Search places using Google Places API
   */
  async searchGooglePlaces(query, latitude, longitude) {
    try {
      const url = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
      const params = {
        query: query,
        location: `${latitude},${longitude}`,
        radius: 10000,
        key: this.googleMapsApiKey
      };

      const response = await axios.get(url, { params });
      
      if (response.data.status !== 'OK') {
        throw new Error(`Google Places API error: ${response.data.status}`);
      }

      return this.formatGooglePlaces(response.data.results, latitude, longitude);
    } catch (error) {
      console.error('Error searching Google Places:', error);
      return [];
    }
  }

  /**
   * Get Google place details
   */
  async getGooglePlaceDetails(placeId) {
    try {
      const url = 'https://maps.googleapis.com/maps/api/place/details/json';
      const params = {
        place_id: placeId,
        fields: 'name,rating,formatted_phone_number,website,opening_hours,reviews,photos',
        key: this.googleMapsApiKey
      };

      const response = await axios.get(url, { params });
      
      if (response.data.status !== 'OK') {
        throw new Error(`Google Places API error: ${response.data.status}`);
      }

      return response.data.result;
    } catch (error) {
      console.error('Error getting Google place details:', error);
      throw error;
    }
  }

  /**
   * Get OSM place details
   */
  async getOSMPlaceDetails(placeId) {
    try {
      const osmId = placeId.replace('osm_', '');
      const url = `${this.nominatimApiUrl}/lookup`;
      const params = {
        osm_ids: `N${osmId}`,
        format: 'json'
      };

      const response = await axios.get(url, { params });
      return response.data[0] || null;
    } catch (error) {
      console.error('Error getting OSM place details:', error);
      throw error;
    }
  }
}

module.exports = new PlacesService();
