const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function testBackend() {
  console.log('🧪 Testing NearbyNomad Backend...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);

    // Test 2: Location Update
    console.log('\n2. Testing location update...');
    const locationResponse = await axios.post(`${BASE_URL}/api/location/update`, {
      userId: 'test-user-123',
      latitude: 37.7749,
      longitude: -122.4194,
      metadata: {
        accuracy: 10,
        address: 'San Francisco, CA'
      }
    });
    console.log('✅ Location update successful:', locationResponse.data);

    // Test 3: Get User Location
    console.log('\n3. Testing get user location...');
    const getUserLocationResponse = await axios.get(`${BASE_URL}/api/location/test-user-123`);
    console.log('✅ Get user location successful:', getUserLocationResponse.data);

    // Test 4: Get Nearby Places
    console.log('\n4. Testing get nearby places...');
    const placesResponse = await axios.get(`${BASE_URL}/api/places/nearby`, {
      params: {
        latitude: 37.7749,
        longitude: -122.4194,
        radius: 1000,
        interests: 'eat,relax',
        mood: 'happy',
        energyLevel: 70
      }
    });
    console.log('✅ Get nearby places successful:', placesResponse.data.meta);

    // Test 5: Generate Recommendations
    console.log('\n5. Testing generate recommendations...');
    const recommendationsResponse = await axios.post(`${BASE_URL}/api/recommendations/generate`, {
      userLocation: {
        latitude: 37.7749,
        longitude: -122.4194
      },
      preferences: {
        mood: 'happy',
        interests: ['eat', 'relax'],
        energyLevel: 70,
        budget: 50,
        transport: 'walk',
        socialMode: 'solo',
        accessibility: [],
        foodTypes: []
      },
      radius: 1000
    });
    console.log('✅ Generate recommendations successful:', {
      topRecommendations: recommendationsResponse.data.data.topRecommendations?.length || 0,
      byCategory: Object.keys(recommendationsResponse.data.data.byCategory || {}).length
    });

    // Test 6: Generate Uber Ride
    console.log('\n6. Testing generate Uber ride...');
    const uberResponse = await axios.post(`${BASE_URL}/api/uber/ride`, {
      pickupLocation: {
        latitude: 37.7749,
        longitude: -122.4194,
        address: 'Current Location'
      },
      destinationLocation: {
        latitude: 37.7849,
        longitude: -122.4094,
        address: 'Destination'
      }
    });
    console.log('✅ Generate Uber ride successful:', {
      deepLink: uberResponse.data.data.deepLink ? 'Generated' : 'Not generated',
      webUrl: uberResponse.data.data.webUrl ? 'Generated' : 'Not generated'
    });

    // Test 7: Search Places
    console.log('\n7. Testing search places...');
    const searchResponse = await axios.get(`${BASE_URL}/api/places/search`, {
      params: {
        query: 'coffee',
        latitude: 37.7749,
        longitude: -122.4194
      }
    });
    console.log('✅ Search places successful:', searchResponse.data.meta);

    console.log('\n🎉 All tests passed! Backend is working correctly.');
    console.log('\n📋 Test Summary:');
    console.log('- Health check: ✅');
    console.log('- Location tracking: ✅');
    console.log('- Places API: ✅');
    console.log('- Recommendations: ✅');
    console.log('- Uber integration: ✅');
    console.log('- Search functionality: ✅');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the backend server is running on port 5000');
    console.log('2. Check if all dependencies are installed: npm install');
    console.log('3. Verify environment variables are set correctly');
    console.log('4. Check server logs for any errors');
  }
}

// Run tests
testBackend();
