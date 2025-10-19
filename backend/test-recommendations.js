// Test script for recommendations API
const { getRecommendations } = require('./services/recommendationService');

console.log('🧪 Testing Recommendation Service...\n');

// Test case 1: Happy mood with relax interest
const testPreferences1 = {
  mood: 'happy',
  interests: ['relax', 'eat'],
  foodTypes: ['home'],
  energyLevel: 'low',
  budget: '25',
  transport: 'walk',
  socialMode: 'solo',
  accessibility: ['safe']
};

console.log('Test 1: Happy mood, relax interest, low energy');
console.log('Preferences:', JSON.stringify(testPreferences1, null, 2));
const result1 = getRecommendations(testPreferences1);
console.log(`Found ${result1.recommendations.length} recommendations`);
console.log('Top 3 recommendations:');
result1.recommendations.slice(0, 3).forEach((place, index) => {
  console.log(`${index + 1}. ${place.name} (${place.category}) - Score: ${place.finalScore || place.score || 'N/A'}`);
  console.log(`     Match Reason: ${place.matchReason}`);
});
console.log('\n---\n');

// Test case 2: Excited mood with adventure interests
const testPreferences2 = {
  mood: 'excited',
  interests: ['play', 'sports'],
  foodTypes: [],
  energyLevel: 'high',
  budget: '100',
  transport: 'car',
  socialMode: 'friends',
  accessibility: []
};

console.log('Test 2: Excited mood, adventure interests, high energy');
console.log('Preferences:', JSON.stringify(testPreferences2, null, 2));
const result2 = getRecommendations(testPreferences2);
console.log(`Found ${result2.recommendations.length} recommendations`);
console.log('Top 3 recommendations:');
result2.recommendations.slice(0, 3).forEach((place, index) => {
  console.log(`${index + 1}. ${place.name} (${place.category}) - Score: ${place.finalScore || place.score || 'N/A'}`);
  console.log(`     Match Reason: ${place.matchReason}`);
});
console.log('\n---\n');

// Test case 3: Tired mood with relax interest
const testPreferences3 = {
  mood: 'tired',
  interests: ['relax'],
  foodTypes: ['home'],
  energyLevel: 'low',
  budget: '15',
  transport: 'walk',
  socialMode: 'solo',
  accessibility: ['safe']
};

console.log('Test 3: Tired mood, relax interest, low energy');
console.log('Preferences:', JSON.stringify(testPreferences3, null, 2));
const result3 = getRecommendations(testPreferences3);
console.log(`Found ${result3.recommendations.length} recommendations`);
console.log('Top 3 recommendations:');
result3.recommendations.slice(0, 3).forEach((place, index) => {
  console.log(`${index + 1}. ${place.name} (${place.category}) - Score: ${place.finalScore || place.score || 'N/A'}`);
  console.log(`     Match Reason: ${place.matchReason}`);
});

console.log('\n✅ Recommendation service tests completed!');
