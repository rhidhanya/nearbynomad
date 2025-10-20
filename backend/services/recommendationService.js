// Enhanced Recommendation Service for NearbyNomad
const fs = require('fs');
const path = require('path');

// Load places data from the JSON file
const loadPlacesData = () => {
  try {
    const placesPath = path.join(__dirname, '../../src/data/places.json');
    const placesData = fs.readFileSync(placesPath, 'utf8');
    return JSON.parse(placesData);
  } catch (error) {
    console.error('Error loading places data:', error);
    return [];
  }
};

// Enhanced energy level mapping with 5 levels
const ENERGY_LEVELS = {
  'very_low': { maxDistance: 1, weight: 0.8, activityLevel: 0.2 },
  'low': { maxDistance: 2, weight: 0.6, activityLevel: 0.4 },
  'medium': { maxDistance: 5, weight: 0.4, activityLevel: 0.6 },
  'high': { maxDistance: 10, weight: 0.2, activityLevel: 0.8 },
  'very_high': { maxDistance: 20, weight: 0.1, activityLevel: 1.0 }
};

// Mood-based scoring system
const MOOD_SCORING = {
  'happy': {
    categories: { 'Cafe': 0.9, 'Restaurant': 0.8, 'Sightseeing': 0.7, 'Shopping': 0.6, 'Temple': 0.5 },
    keywords: ['beautiful', 'scenic', 'vibrant', 'colorful', 'cheerful'],
    energyBoost: 0.1
  },
  'excited': {
    categories: { 'Adventure': 1.0, 'Sightseeing': 0.8, 'Shopping': 0.6, 'Cafe': 0.4, 'Temple': 0.3 },
    keywords: ['adventure', 'thrilling', 'exciting', 'amazing', 'breathtaking'],
    energyBoost: 0.2
  },
  'relaxed': {
    categories: { 'Temple': 0.9, 'Cafe': 0.8, 'Sightseeing': 0.6, 'Restaurant': 0.5, 'Shopping': 0.3 },
    keywords: ['peaceful', 'serene', 'calm', 'tranquil', 'quiet'],
    energyBoost: -0.1
  },
  'curious': {
    categories: { 'Sightseeing': 0.9, 'Temple': 0.8, 'Cafe': 0.6, 'Restaurant': 0.5, 'Shopping': 0.4 },
    keywords: ['historical', 'cultural', 'unique', 'interesting', 'fascinating'],
    energyBoost: 0.05
  },
  'adventurous': {
    categories: { 'Adventure': 1.0, 'Sightseeing': 0.7, 'Cafe': 0.3, 'Temple': 0.2, 'Shopping': 0.1 },
    keywords: ['adventure', 'challenging', 'extreme', 'outdoor', 'thrilling'],
    energyBoost: 0.3
  },
  'romantic': {
    categories: { 'Restaurant': 0.9, 'Cafe': 0.8, 'Sightseeing': 0.7, 'Temple': 0.4, 'Shopping': 0.5 },
    keywords: ['romantic', 'intimate', 'beautiful', 'scenic', 'cozy'],
    energyBoost: 0.0
  },
  'tired': {
    categories: { 'Cafe': 0.9, 'Temple': 0.8, 'Restaurant': 0.7, 'Sightseeing': 0.3, 'Shopping': 0.2 },
    keywords: ['comfortable', 'cozy', 'peaceful', 'quiet', 'relaxing'],
    energyBoost: -0.2
  },
  'social': {
    categories: { 'Restaurant': 0.9, 'Cafe': 0.8, 'Shopping': 0.7, 'Sightseeing': 0.5, 'Temple': 0.3 },
    keywords: ['social', 'lively', 'vibrant', 'crowded', 'popular'],
    energyBoost: 0.1
  }
  }
};

// Interest-based scoring
const INTEREST_SCORING = {
  'relax': { categories: { 'Temple': 0.9, 'Cafe': 0.8, 'Sightseeing': 0.6 }, keywords: ['peaceful', 'serene', 'calm'] },
  'eat': { categories: { 'Restaurant': 1.0, 'Cafe': 0.7, 'Shopping': 0.3 }, keywords: ['food', 'delicious', 'cuisine'] },
  'sightseeing': { categories: { 'Sightseeing': 1.0, 'Temple': 0.8, 'Cafe': 0.4 }, keywords: ['beautiful', 'scenic', 'view'] },
  'shop': { categories: { 'Shopping': 1.0, 'Cafe': 0.5, 'Restaurant': 0.4 }, keywords: ['shopping', 'market', 'mall'] },
  'adventure': { categories: { 'Adventure': 1.0, 'Sightseeing': 0.6, 'Cafe': 0.2 }, keywords: ['adventure', 'thrilling', 'exciting'] },
  'culture': { categories: { 'Temple': 0.9, 'Sightseeing': 0.8, 'Cafe': 0.4 }, keywords: ['historical', 'cultural', 'traditional'] }
};

// Budget scoring
const BUDGET_SCORING = {
  'low': { maxPrice: 1, weight: 0.8 },
  'medium': { maxPrice: 2, weight: 0.6 },
  'high': { maxPrice: 3, weight: 0.4 }
};

// Transport mode preferences
const TRANSPORT_SCORING = {
  'walk': { maxDistance: 2, weight: 1.0 },
  'bike': { maxDistance: 5, weight: 0.8 },
  'car': { maxDistance: 20, weight: 0.6 },
  'public': { maxDistance: 10, weight: 0.7 }
};

// Social mode preferences
const SOCIAL_SCORING = {
  'solo': { keywords: ['peaceful', 'quiet', 'cozy'], categories: { 'Temple': 0.9, 'Cafe': 0.8 } },
  'friends': { keywords: ['lively', 'fun', 'social'], categories: { 'Restaurant': 0.9, 'Shopping': 0.8 } },
  'family': { keywords: ['family', 'safe', 'comfortable'], categories: { 'Sightseeing': 0.9, 'Temple': 0.8 } },
  'date': { keywords: ['romantic', 'intimate', 'beautiful'], categories: { 'Restaurant': 0.9, 'Cafe': 0.8 } }
};

// Parse distance from string (e.g., "1.5 km" -> 1.5)
const parseDistance = (distanceStr) => {
  if (!distanceStr) return 0;
  const match = distanceStr.match(/(\d+(?:\.\d+)?)\s*km/);
  return match ? parseFloat(match[1]) : 0;
};

// Calculate base score for a place based on user preferences
const calculateBaseScore = (place, preferences) => {
  let score = 0;
  const { mood, interests = [], energyLevel, budget, transport, socialMode } = preferences;
  
  // Mood-based scoring
  const moodConfig = MOOD_SCORING[mood] || MOOD_SCORING['happy'];
  const categoryScore = moodConfig.categories[place.category] || 0;
  score += categoryScore * 30;
  
  // Interest-based scoring
  interests.forEach(interest => {
    const interestConfig = INTEREST_SCORING[interest];
    if (interestConfig) {
      const interestCategoryScore = interestConfig.categories[place.category] || 0;
      score += interestCategoryScore * 20;
    }
  });
  
  // Energy level scoring
  const energyConfig = ENERGY_LEVELS[energyLevel] || ENERGY_LEVELS['medium'];
  const distance = parseDistance(place.distance);
  if (distance <= energyConfig.maxDistance) {
<<<<<<< HEAD
    score += 25;
  } else {
    score -= (distance - energyConfig.maxDistance) * 5;
  }
  
  // Budget scoring
  const budgetConfig = BUDGET_SCORING[budget] || BUDGET_SCORING['medium'];
  const placePrice = place.price === '$' ? 1 : place.price === '$$' ? 2 : 3;
  if (placePrice <= budgetConfig.maxPrice) {
    score += 20;
  }
  
  // Transport scoring
  const transportConfig = TRANSPORT_SCORING[transport] || TRANSPORT_SCORING['car'];
  if (distance <= transportConfig.maxDistance) {
    score += 15;
  }
  
  // Social mode scoring
  const socialConfig = SOCIAL_SCORING[socialMode] || SOCIAL_SCORING['solo'];
  const socialCategoryScore = socialConfig.categories[place.category] || 0;
  score += socialCategoryScore * 15;
  
  // Rating boost
  if (place.rating) {
    score += (place.rating - 3) * 5; // Boost for ratings above 3
  }
  
  return Math.max(0, score);
};

// Add randomization to prevent repetitive results
const addRandomization = (score, place, preferences) => {
  // Small random factor (0.8 to 1.2)
  const randomFactor = 0.8 + Math.random() * 0.4;
  
  // Time-based rotation (changes every hour)
  const hour = new Date().getHours();
  const timeRotation = Math.sin(hour * 0.1) * 0.1;
  
  // Place ID-based rotation for variety
  const idRotation = Math.sin(place.id * 0.5) * 0.05;
  
  return score * randomFactor + timeRotation + idRotation;
=======
    score += 20 * (1 - distance / energyConfig.maxDistance);
  } else {
    score -= (distance - energyConfig.maxDistance) * 2;
  }
  if (place.energyLevel === energyLevel) {
    score += 15;
  }

  // Budget scoring
  const budgetConfig = BUDGET_SCORING[budget] || BUDGET_SCORING['medium'];
  const placePrice = place.price === 'Free' ? 0 : place.price === '$' ? 1 : place.price === '$$' ? 2 : 3;
  if (placePrice <= budgetConfig.maxPrice) {
    score += 15 * (1 - placePrice / budgetConfig.maxPrice);
  } else {
    score -= (placePrice - budgetConfig.maxPrice) * 5;
  }

  // Transport scoring
  const transportConfig = TRANSPORT_SCORING[transport] || TRANSPORT_SCORING['car'];
  if (place.transportModes.includes(transport) && distance <= transportConfig.maxDistance) {
    score += 10 * transportConfig.weight;
  }

  // Social mode scoring
  const socialConfig = SOCIAL_SCORING[socialMode] || SOCIAL_SCORING['solo'];
  if (place.socialModes.includes(socialMode)) {
    score += 15;
    const socialKeywords = socialConfig.keywords || [];
    const matchingSocialKeywords = place.tags.filter(tag => socialKeywords.includes(tag.toLowerCase()));
    score += matchingSocialKeywords.length * 5;
  }

  // Accessibility scoring
  const matchingAccessibility = accessibility.filter(acc => place.accessibility.includes(acc));
  score += matchingAccessibility.length * 10;

  // Food type scoring
  const matchingFoodTypes = foodTypes.filter(food => place.foodTypes.includes(food));
  score += matchingFoodTypes.length * 15;

  // Rating boost
  if (place.rating) {
    score += (place.rating - 3) * 5;
  }

  return Math.max(0, score);
};

// Generate match reason for a place
const generateMatchReason = (place, preferences) => {
  const reasons = [];
  const { mood, interests = [], energyLevel, socialMode } = preferences;
  
  // Mood-based reasons
  const moodConfig = MOOD_SCORING[mood];
  if (moodConfig && moodConfig.categories[place.category] > 0.7) {
    reasons.push(`Perfect for ${mood} mood`);
  }
  
  // Interest-based reasons
  interests.forEach(interest => {
    const interestConfig = INTEREST_SCORING[interest];
    if (interestConfig && interestConfig.categories[place.category] > 0.7) {
      reasons.push(`Matches your ${interest} interest`);
    }
  });
  
  // Energy level reasons
  const distance = parseDistance(place.distance);
  const energyConfig = ENERGY_LEVELS[energyLevel];
  if (distance <= energyConfig.maxDistance) {
    reasons.push(`Perfect distance for ${energyLevel} energy`);
  }
  
  // Social mode reasons
  const socialConfig = SOCIAL_SCORING[socialMode];
  if (socialConfig && socialConfig.categories[place.category] > 0.7) {
    reasons.push(`Great for ${socialMode} visits`);
  }
  
  // Rating reasons
  if (place.rating && place.rating > 4.0) {
    reasons.push(`Highly rated (${place.rating}/5)`);
  }
  
  return reasons.length > 0 ? reasons.join(', ') : 'Good match for your preferences';
};

// Main recommendation function
const getRecommendations = (userPreferences) => {
  try {
    // Load places data
    const places = loadPlacesData();
    if (!places || places.length === 0) {
      return {
        success: false,
        error: 'No places data available',
        recommendations: []
      };
    }
<<<<<<< HEAD
    
=======

>>>>>>> 204dc87d (updated)
    // Validate user preferences
    if (!userPreferences || !userPreferences.mood) {
      return {
        success: false,
        error: 'Invalid user preferences',
        recommendations: []
      };
    }
<<<<<<< HEAD
    
    // Calculate scores for all places
    const scoredPlaces = places.map(place => {
      const baseScore = calculateBaseScore(place, userPreferences);
      const finalScore = addRandomization(baseScore, place, userPreferences);
      const matchReason = generateMatchReason(place, userPreferences);
      
=======

    // Calculate scores for all places
    const scoredPlaces = places.map(place => {
      const baseScore = calculateBaseScore(place, userPreferences, usedPlaceIds);
      const randomFactor = 0.9 + Math.random() * 0.2; // Small randomization for variety
      const finalScore = baseScore * randomFactor;
      const matchReason = generateMatchReason(place, userPreferences);

      return {
        ...place,
        finalScore: Math.round(finalScore * 100) / 100,
        matchReason,
        baseScore: Math.round(baseScore * 100) / 100,
        score: Math.round(finalScore * 100) / 100 // Add this for compatibility
      };
    });
    
    // Sort by final score and get top 6
    const topRecommendations = scoredPlaces
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, 6);
    
    // Add variety by occasionally rotating top results
    if (Math.random() < 0.3) { // 30% chance to rotate
      const [first, ...rest] = topRecommendations;
      const rotated = [...rest, first];
      return {
        success: true,
        recommendations: rotated,
        totalPlaces: places.length,
        userPreferences,
        generatedAt: new Date().toISOString()
      };
    }
    
    return {
      success: true,
      recommendations: topRecommendations,
      totalPlaces: places.length,
      userPreferences,
      generatedAt: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error in getRecommendations:', error);
    return {
      success: false,
      error: error.message,
      recommendations: []
    };
  }
};

// API route handler
const recommendPlaces = async (req, res) => {
  try {
    const preferences = req.body;
    const result = getRecommendations(preferences);
    
    if (result.success) {
      res.json({
        success: true,
        data: result,
        message: `Found ${result.recommendations.length} personalized recommendations`
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        message: 'Failed to generate recommendations'
      });
    }
  } catch (error) {
    console.error('Error in recommendPlaces:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to process recommendation request'
    });
  }
};

// Get user preferences from request
const getUserPreferencesFromRequest = (req) => {
  return req.body || {};
};

module.exports = {
  getRecommendations,
  recommendPlaces,
  getUserPreferencesFromRequest,
  loadPlacesData
};