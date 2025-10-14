const _ = require('lodash');
const moment = require('moment');

class RecommendationService {
  constructor() {
    this.moodProfiles = this.initializeMoodProfiles();
    this.interestWeights = this.initializeInterestWeights();
    this.timeBasedFactors = this.initializeTimeBasedFactors();
  }

  /**
   * Generate personalized recommendations based on user preferences and location
   * @param {object} userPreferences - User's mood and preferences
   * @param {array} nearbyPlaces - Array of nearby places
   * @param {object} userLocation - User's current location
   */
  async generateRecommendations(userPreferences, nearbyPlaces, userLocation) {
    try {
      const {
        mood = '',
        interests = [],
        energyLevel = 50,
        budget = 0,
        transport = '',
        socialMode = 'solo',
        accessibility = [],
        foodTypes = []
      } = userPreferences;

      // Calculate recommendation scores for each place
      const scoredPlaces = nearbyPlaces.map(place => {
        const score = this.calculateRecommendationScore(place, userPreferences, userLocation);
        return { ...place, recommendationScore: score };
      });

      // Sort by recommendation score
      const sortedPlaces = scoredPlaces.sort((a, b) => b.recommendationScore - a.recommendationScore);

      // Apply additional filters and enhancements
      const enhancedPlaces = this.enhancePlaceRecommendations(sortedPlaces, userPreferences);

      // Generate different recommendation categories
      const recommendations = {
        topRecommendations: enhancedPlaces.slice(0, 10),
        byCategory: this.groupRecommendationsByCategory(enhancedPlaces),
        itinerary: this.generateItinerary(enhancedPlaces.slice(0, 5), userPreferences),
        surpriseMe: this.generateSurpriseRecommendations(enhancedPlaces, userPreferences),
        nearby: this.getNearbyRecommendations(enhancedPlaces, userLocation),
        trending: this.getTrendingRecommendations(enhancedPlaces)
      };

      return recommendations;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw error;
    }
  }

  /**
   * Calculate recommendation score for a place
   */
  calculateRecommendationScore(place, preferences, userLocation) {
    let score = 0;
    const { mood, interests, energyLevel, budget, transport, socialMode, accessibility } = preferences;

    // Base score from place rating
    score += place.rating * 10;

    // Distance factor (closer is better, but not too close)
    const distanceScore = this.calculateDistanceScore(place.distance, energyLevel, transport);
    score += distanceScore;

    // Mood matching
    const moodScore = this.calculateMoodScore(place, mood);
    score += moodScore;

    // Interest matching
    const interestScore = this.calculateInterestScore(place, interests);
    score += interestScore;

    // Budget compatibility
    const budgetScore = this.calculateBudgetScore(place, budget);
    score += budgetScore;

    // Social mode compatibility
    const socialScore = this.calculateSocialScore(place, socialMode);
    score += socialScore;

    // Accessibility compatibility
    const accessibilityScore = this.calculateAccessibilityScore(place, accessibility);
    score += accessibilityScore;

    // Time-based factors
    const timeScore = this.calculateTimeBasedScore(place);
    score += timeScore;

    // Food type matching (if applicable)
    const foodScore = this.calculateFoodTypeScore(place, preferences.foodTypes);
    score += foodScore;

    // Popularity boost
    const popularityScore = this.calculatePopularityScore(place);
    score += popularityScore;

    return Math.max(0, score); // Ensure non-negative score
  }

  /**
   * Calculate distance-based score
   */
  calculateDistanceScore(distance, energyLevel, transport) {
    const maxDistance = this.getMaxDistanceForEnergyLevel(energyLevel, transport);
    
    if (distance > maxDistance) {
      return -10; // Penalty for being too far
    }

    // Optimal distance range based on energy level
    let optimalMin, optimalMax;
    if (energyLevel < 33) {
      optimalMin = 100; // Very close
      optimalMax = 500;
    } else if (energyLevel < 66) {
      optimalMin = 200;
      optimalMax = 1500;
    } else {
      optimalMin = 500;
      optimalMax = 3000;
    }

    if (distance >= optimalMin && distance <= optimalMax) {
      return 15; // Bonus for optimal distance
    } else if (distance < optimalMin) {
      return 5; // Slight bonus for very close
    } else {
      return Math.max(-5, 10 - (distance / 1000)); // Decreasing score with distance
    }
  }

  /**
   * Calculate mood-based score
   */
  calculateMoodScore(place, mood) {
    const moodMappings = {
      'happy': {
        'Restaurant': 8,
        'Cafe': 6,
        'Park': 7,
        'Bar': 5,
        'Entertainment': 10,
        'Shopping': 4
      },
      'tired': {
        'Cafe': 10,
        'Park': 8,
        'Restaurant': 6,
        'Spa': 9,
        'Hotel': 7
      },
      'calm': {
        'Park': 10,
        'Cafe': 8,
        'Temple': 9,
        'Library': 7,
        'Restaurant': 5
      },
      'romantic': {
        'Restaurant': 10,
        'Cafe': 8,
        'Park': 7,
        'Bar': 6,
        'Hotel': 5
      },
      'sad': {
        'Park': 9,
        'Cafe': 8,
        'Temple': 7,
        'Restaurant': 6,
        'Entertainment': 4
      },
      'excited': {
        'Entertainment': 10,
        'Bar': 8,
        'Restaurant': 6,
        'Park': 5,
        'Shopping': 4
      }
    };

    return moodMappings[mood]?.[place.category] || 0;
  }

  /**
   * Calculate interest-based score
   */
  calculateInterestScore(place, interests) {
    const interestMappings = {
      'eat': ['Restaurant', 'Cafe', 'Bar', 'Fast Food'],
      'relax': ['Cafe', 'Park', 'Spa', 'Hotel'],
      'play': ['Playground', 'Park', 'Gym', 'Entertainment'],
      'sightseeing': ['Attraction', 'Museum', 'Park', 'Temple'],
      'nature': ['Park', 'Zoo', 'Aquarium', 'Garden'],
      'sports': ['Gym', 'Stadium', 'Park', 'Sports Center'],
      'events': ['Bar', 'Entertainment', 'Restaurant', 'Concert Hall']
    };

    let score = 0;
    interests.forEach(interest => {
      if (interestMappings[interest]?.includes(place.category)) {
        score += 8;
      }
    });

    return score;
  }

  /**
   * Calculate budget compatibility score
   */
  calculateBudgetScore(place, budget) {
    if (budget === 0) return 0; // No budget constraint

    const budgetLevel = this.getBudgetLevel(budget);
    const placePriceLevel = place.priceLevel || 2;

    if (budgetLevel >= placePriceLevel) {
      return 5; // Within budget
    } else {
      return -10; // Over budget
    }
  }

  /**
   * Calculate social mode compatibility score
   */
  calculateSocialScore(place, socialMode) {
    const socialMappings = {
      'solo': {
        'Cafe': 8,
        'Park': 7,
        'Restaurant': 6,
        'Library': 9,
        'Museum': 8
      },
      'friends': {
        'Restaurant': 9,
        'Bar': 8,
        'Entertainment': 10,
        'Park': 7,
        'Shopping': 6
      }
    };

    return socialMappings[socialMode]?.[place.category] || 0;
  }

  /**
   * Calculate accessibility compatibility score
   */
  calculateAccessibilityScore(place, accessibility) {
    let score = 0;

    if (accessibility.includes('wheelchair') && place.wheelchairAccessible) {
      score += 10;
    } else if (accessibility.includes('wheelchair') && !place.wheelchairAccessible) {
      score -= 15;
    }

    if (accessibility.includes('pet') && place.petFriendly) {
      score += 5;
    } else if (accessibility.includes('pet') && !place.petFriendly) {
      score -= 5;
    }

    if (accessibility.includes('kid') && place.kidFriendly) {
      score += 5;
    } else if (accessibility.includes('kid') && !place.kidFriendly) {
      score -= 5;
    }

    return score;
  }

  /**
   * Calculate time-based score
   */
  calculateTimeBasedScore(place) {
    const currentHour = moment().hour();
    let score = 0;

    // Time-based preferences
    if (currentHour >= 6 && currentHour < 10) {
      // Morning - prefer cafes, parks
      if (['Cafe', 'Park'].includes(place.category)) score += 5;
    } else if (currentHour >= 10 && currentHour < 14) {
      // Late morning/early afternoon - prefer restaurants, attractions
      if (['Restaurant', 'Attraction', 'Museum'].includes(place.category)) score += 5;
    } else if (currentHour >= 14 && currentHour < 18) {
      // Afternoon - prefer parks, cafes, shopping
      if (['Park', 'Cafe', 'Shopping'].includes(place.category)) score += 5;
    } else if (currentHour >= 18 && currentHour < 22) {
      // Evening - prefer restaurants, bars, entertainment
      if (['Restaurant', 'Bar', 'Entertainment'].includes(place.category)) score += 5;
    } else {
      // Late night - prefer bars, entertainment
      if (['Bar', 'Entertainment'].includes(place.category)) score += 5;
    }

    return score;
  }

  /**
   * Calculate food type compatibility score
   */
  calculateFoodTypeScore(place, foodTypes) {
    if (!foodTypes || foodTypes.length === 0) return 0;
    if (!['Restaurant', 'Cafe', 'Bar', 'Fast Food'].includes(place.category)) return 0;

    const foodTypeMappings = {
      'junk': ['Fast Food', 'Bar'],
      'home': ['Restaurant'],
      'desserts': ['Cafe', 'Restaurant']
    };

    let score = 0;
    foodTypes.forEach(foodType => {
      if (foodTypeMappings[foodType]?.includes(place.category)) {
        score += 6;
      }
    });

    return score;
  }

  /**
   * Calculate popularity score
   */
  calculatePopularityScore(place) {
    // Higher rating = more popular
    const ratingScore = (place.rating - 3) * 5; // Scale rating to score
    
    // Distance penalty for very close places (might be too crowded)
    const distancePenalty = place.distance < 100 ? -2 : 0;
    
    return ratingScore + distancePenalty;
  }

  /**
   * Enhance place recommendations with additional data
   */
  enhancePlaceRecommendations(places, preferences) {
    return places.map(place => {
      const enhanced = { ...place };

      // Add mood match description
      enhanced.moodMatch = this.generateMoodMatchDescription(place, preferences.mood);
      enhanced.moodEmoji = this.getMoodEmoji(place, preferences.mood);

      // Add time estimates
      enhanced.timeEstimate = this.calculateTimeEstimate(place, preferences);
      
      // Add cost estimate
      enhanced.costEstimate = this.calculateCostEstimate(place, preferences);

      // Add accessibility info
      enhanced.accessibilityInfo = this.generateAccessibilityInfo(place, preferences.accessibility);

      // Add tags based on preferences
      enhanced.relevantTags = this.generateRelevantTags(place, preferences);

      return enhanced;
    });
  }

  /**
   * Generate mood match description
   */
  generateMoodMatchDescription(place, mood) {
    const descriptions = {
      'happy': {
        'Restaurant': 'Perfect for celebrating!',
        'Cafe': 'Great for a cheerful coffee break',
        'Park': 'Ideal for outdoor happiness',
        'Bar': 'Perfect for socializing',
        'Entertainment': 'Guaranteed to lift your spirits!'
      },
      'tired': {
        'Cafe': 'Perfect for a relaxing break',
        'Park': 'Great for peaceful rest',
        'Restaurant': 'Comfort food awaits',
        'Spa': 'Just what you need to unwind',
        'Hotel': 'Perfect for a quick rest'
      },
      'calm': {
        'Park': 'Perfect for peaceful moments',
        'Cafe': 'Ideal for quiet reflection',
        'Temple': 'Great for inner peace',
        'Library': 'Perfect for quiet time',
        'Restaurant': 'Calm dining experience'
      },
      'romantic': {
        'Restaurant': 'Perfect for a romantic dinner',
        'Cafe': 'Ideal for intimate conversations',
        'Park': 'Great for romantic walks',
        'Bar': 'Perfect for date night',
        'Hotel': 'Romantic getaway spot'
      },
      'sad': {
        'Park': 'Nature can be healing',
        'Cafe': 'Comfort in a cup',
        'Temple': 'Peaceful reflection space',
        'Restaurant': 'Comfort food for the soul',
        'Entertainment': 'Might help lift your mood'
      },
      'excited': {
        'Entertainment': 'Perfect for your energy!',
        'Bar': 'Great for socializing',
        'Restaurant': 'Perfect for celebrations',
        'Park': 'Great for active fun',
        'Shopping': 'Perfect for retail therapy'
      }
    };

    return descriptions[mood]?.[place.category] || 'Great choice for your mood!';
  }

  /**
   * Get mood emoji for place
   */
  getMoodEmoji(place, mood) {
    const emojis = {
      'happy': {
        'Restaurant': '😊',
        'Cafe': '☕',
        'Park': '🌞',
        'Bar': '🍻',
        'Entertainment': '🎉'
      },
      'tired': {
        'Cafe': '😴',
        'Park': '🌙',
        'Restaurant': '🍲',
        'Spa': '🧘',
        'Hotel': '🛏️'
      },
      'calm': {
        'Park': '🌸',
        'Cafe': '🧘',
        'Temple': '🕯️',
        'Library': '📚',
        'Restaurant': '🍵'
      },
      'romantic': {
        'Restaurant': '💕',
        'Cafe': '💖',
        'Park': '🌹',
        'Bar': '🍷',
        'Hotel': '💑'
      },
      'sad': {
        'Park': '🌧️',
        'Cafe': '☕',
        'Temple': '🕊️',
        'Restaurant': '🍜',
        'Entertainment': '🎭'
      },
      'excited': {
        'Entertainment': '🤩',
        'Bar': '🎊',
        'Restaurant': '🎉',
        'Park': '🏃',
        'Shopping': '🛍️'
      }
    };

    return emojis[mood]?.[place.category] || '📍';
  }

  /**
   * Calculate time estimate for visiting a place
   */
  calculateTimeEstimate(place, preferences) {
    const baseTimes = {
      'Restaurant': 60,
      'Cafe': 30,
      'Bar': 90,
      'Park': 45,
      'Museum': 120,
      'Shopping': 90,
      'Entertainment': 120,
      'Temple': 30,
      'Hotel': 0,
      'Spa': 90
    };

    let time = baseTimes[place.category] || 30;

    // Adjust based on social mode
    if (preferences.socialMode === 'friends') {
      time *= 1.5;
    }

    // Adjust based on energy level
    if (preferences.energyLevel < 33) {
      time *= 0.7; // Shorter visits when tired
    } else if (preferences.energyLevel > 66) {
      time *= 1.3; // Longer visits when energetic
    }

    return Math.round(time);
  }

  /**
   * Calculate cost estimate
   */
  calculateCostEstimate(place, preferences) {
    const baseCosts = {
      1: 5,   // Very cheap
      2: 15,  // Cheap
      3: 35,  // Moderate
      4: 75   // Expensive
    };

    let cost = baseCosts[place.priceLevel] || 20;

    // Adjust based on social mode
    if (preferences.socialMode === 'friends') {
      cost *= 1.5;
    }

    // Adjust based on category
    if (['Park', 'Temple'].includes(place.category)) {
      cost = 0; // Free
    }

    return Math.round(cost);
  }

  /**
   * Generate accessibility information
   */
  generateAccessibilityInfo(place, accessibility) {
    const info = [];

    if (place.wheelchairAccessible) {
      info.push('♿ Wheelchair accessible');
    }
    if (place.petFriendly) {
      info.push('🐶 Pet-friendly');
    }
    if (place.kidFriendly) {
      info.push('👶 Kid-friendly');
    }

    return info;
  }

  /**
   * Generate relevant tags based on preferences
   */
  generateRelevantTags(place, preferences) {
    const tags = [...(place.tags || [])];

    // Add mood-based tags
    if (preferences.mood === 'calm') {
      tags.push('Quiet', 'Peaceful');
    } else if (preferences.mood === 'excited') {
      tags.push('Energetic', 'Fun');
    }

    // Add social mode tags
    if (preferences.socialMode === 'solo') {
      tags.push('Solo-friendly');
    } else if (preferences.socialMode === 'friends') {
      tags.push('Group-friendly');
    }

    return [...new Set(tags)]; // Remove duplicates
  }

  /**
   * Group recommendations by category
   */
  groupRecommendationsByCategory(places) {
    return _.groupBy(places, 'category');
  }

  /**
   * Generate itinerary from top recommendations
   */
  generateItinerary(topPlaces, preferences) {
    if (topPlaces.length === 0) return null;

    const itinerary = {
      totalTime: 0,
      totalDistance: 0,
      totalCost: 0,
      stops: []
    };

    topPlaces.forEach((place, index) => {
      const timeEstimate = this.calculateTimeEstimate(place, preferences);
      const costEstimate = this.calculateCostEstimate(place, preferences);

      itinerary.stops.push({
        order: index + 1,
        place: place,
        timeEstimate: timeEstimate,
        costEstimate: costEstimate,
        description: this.generateStopDescription(place, index, preferences)
      });

      itinerary.totalTime += timeEstimate;
      itinerary.totalCost += costEstimate;
    });

    // Calculate total distance (simplified)
    itinerary.totalDistance = topPlaces.reduce((total, place) => total + place.distance, 0);

    return itinerary;
  }

  /**
   * Generate stop description for itinerary
   */
  generateStopDescription(place, index, preferences) {
    const descriptions = [
      `Start your journey at ${place.name}`,
      `Continue to ${place.name}`,
      `Next, visit ${place.name}`,
      `Then explore ${place.name}`,
      `Finally, end at ${place.name}`
    ];

    return descriptions[index] || `Visit ${place.name}`;
  }

  /**
   * Generate surprise recommendations
   */
  generateSurpriseRecommendations(places, preferences) {
    // Shuffle places and return a random selection
    const shuffled = _.shuffle(places);
    return shuffled.slice(0, 3).map(place => ({
      ...place,
      surpriseReason: this.generateSurpriseReason(place, preferences)
    }));
  }

  /**
   * Generate surprise reason
   */
  generateSurpriseReason(place, preferences) {
    const reasons = [
      'Hidden gem in your area!',
      'Perfect for trying something new',
      'Unexpectedly matches your vibe',
      'Local favorite you might have missed',
      'Great for spontaneous adventures'
    ];

    return reasons[Math.floor(Math.random() * reasons.length)];
  }

  /**
   * Get nearby recommendations
   */
  getNearbyRecommendations(places, userLocation) {
    return places
      .filter(place => place.distance <= 1000) // Within 1km
      .slice(0, 5);
  }

  /**
   * Get trending recommendations
   */
  getTrendingRecommendations(places) {
    return places
      .filter(place => place.rating >= 4.5) // High-rated places
      .slice(0, 5);
  }

  /**
   * Helper methods
   */
  getMaxDistanceForEnergyLevel(energyLevel, transport) {
    const baseDistance = this.getRadiusForEnergyLevel(energyLevel);
    
    switch (transport) {
      case 'walk':
        return Math.min(baseDistance, 1000);
      case 'bike':
        return Math.min(baseDistance, 5000);
      case 'car':
      case 'uber':
        return baseDistance;
      default:
        return baseDistance;
    }
  }

  getRadiusForEnergyLevel(energyLevel) {
    if (energyLevel < 33) return 500;
    if (energyLevel < 66) return 2000;
    return 10000;
  }

  getBudgetLevel(budget) {
    if (budget < 20) return 1;
    if (budget < 50) return 2;
    if (budget < 100) return 3;
    return 4;
  }

  /**
   * Initialize mood profiles
   */
  initializeMoodProfiles() {
    return {
      happy: { energy: 'high', social: 'outgoing', preference: 'fun' },
      tired: { energy: 'low', social: 'quiet', preference: 'rest' },
      calm: { energy: 'low', social: 'peaceful', preference: 'serenity' },
      romantic: { energy: 'medium', social: 'intimate', preference: 'romance' },
      sad: { energy: 'low', social: 'solitary', preference: 'comfort' },
      excited: { energy: 'high', social: 'outgoing', preference: 'adventure' }
    };
  }

  /**
   * Initialize interest weights
   */
  initializeInterestWeights() {
    return {
      eat: { weight: 1.0, categories: ['Restaurant', 'Cafe', 'Bar'] },
      relax: { weight: 0.8, categories: ['Cafe', 'Park', 'Spa'] },
      play: { weight: 1.2, categories: ['Playground', 'Park', 'Entertainment'] },
      sightseeing: { weight: 1.1, categories: ['Attraction', 'Museum', 'Park'] },
      nature: { weight: 0.9, categories: ['Park', 'Zoo', 'Garden'] },
      sports: { weight: 1.3, categories: ['Gym', 'Stadium', 'Park'] },
      events: { weight: 1.4, categories: ['Bar', 'Entertainment', 'Concert Hall'] }
    };
  }

  /**
   * Initialize time-based factors
   */
  initializeTimeBasedFactors() {
    return {
      morning: { preferred: ['Cafe', 'Park'], avoided: ['Bar', 'Entertainment'] },
      afternoon: { preferred: ['Restaurant', 'Museum'], avoided: ['Bar'] },
      evening: { preferred: ['Restaurant', 'Bar'], avoided: ['Park'] },
      night: { preferred: ['Bar', 'Entertainment'], avoided: ['Park', 'Museum'] }
    };
  }
}

module.exports = new RecommendationService();
