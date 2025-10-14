# NearbyNomad Backend

A comprehensive Node.js backend service for location-based recommendations with real-time location tracking, intelligent mood-based suggestions, and Uber integration.

## Features

- 🌍 **Real-time Location Tracking** - WebSocket-based location updates
- 🗺️ **Multi-source Places Data** - OpenStreetMap + Google Maps integration
- 🧠 **Intelligent Recommendations** - Mood and preference-based suggestions
- 🚗 **Uber Integration** - Deep link generation for ride requests
- 📱 **RESTful API** - Complete API for frontend integration
- ⚡ **Real-time Updates** - Socket.io for live location sharing

## Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Google Maps API key (optional)
- Uber API credentials (optional)

### Installation

1. **Clone and setup**
```bash
cd backend
npm install
```

2. **Environment Configuration**
```bash
cp env.example .env
# Edit .env with your API keys
```

3. **Start the server**
```bash
# Development
npm run dev

# Production
npm start
```

The server will start on `http://localhost:5001`

## API Documentation

### Location Endpoints

#### Update User Location
```http
POST /api/location/update
Content-Type: application/json

{
  "userId": "user123",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "metadata": {
    "accuracy": 10,
    "address": "San Francisco, CA"
  }
}
```

#### Get User Location
```http
GET /api/location/:userId
```

#### Get Location History
```http
GET /api/location/:userId/history?limit=10
```

### Places Endpoints

#### Get Nearby Places
```http
GET /api/places/nearby?latitude=37.7749&longitude=-122.4194&radius=1000&interests=eat,relax&mood=happy&energyLevel=70
```

#### Search Places
```http
GET /api/places/search?query=coffee&latitude=37.7749&longitude=-122.4194
```

#### Get Place Details
```http
GET /api/places/:placeId?source=osm
```

### Recommendations Endpoints

#### Generate Recommendations
```http
POST /api/recommendations/generate
Content-Type: application/json

{
  "userLocation": {
    "latitude": 37.7749,
    "longitude": -122.4194
  },
  "preferences": {
    "mood": "happy",
    "interests": ["eat", "relax"],
    "energyLevel": 70,
    "budget": 50,
    "transport": "walk",
    "socialMode": "solo",
    "accessibility": ["wheelchair"],
    "foodTypes": ["junk", "desserts"]
  },
  "radius": 1000
}
```

#### Generate Itinerary
```http
POST /api/recommendations/itinerary
Content-Type: application/json

{
  "places": [...],
  "userLocation": {...},
  "preferences": {...}
}
```

### Uber Endpoints

#### Generate Ride Deep Link
```http
POST /api/uber/ride
Content-Type: application/json

{
  "pickupLocation": {
    "latitude": 37.7749,
    "longitude": -122.4194,
    "address": "Current Location"
  },
  "destinationLocation": {
    "latitude": 37.7849,
    "longitude": -122.4094,
    "address": "Destination"
  },
  "options": {
    "productId": "uberx"
  }
}
```

#### Generate Destination-Only Link
```http
POST /api/uber/destination
Content-Type: application/json

{
  "destinationLocation": {
    "latitude": 37.7849,
    "longitude": -122.4094,
    "address": "Destination"
  }
}
```

## WebSocket Events

### Client to Server

#### Location Update
```javascript
socket.emit('location-update', {
  userId: 'user123',
  latitude: 37.7749,
  longitude: -122.4194,
  accuracy: 10
});
```

### Server to Client

#### Location Updated
```javascript
socket.on('location-updated', (data) => {
  console.log('Location updated:', data);
});
```

#### User Location Updated (Broadcast)
```javascript
socket.on('user-location-updated', (data) => {
  console.log('User location updated:', data);
});
```

## Services Architecture

### LocationService
- Real-time location tracking
- Location history management
- Distance calculations
- Nearby user detection

### PlacesService
- OpenStreetMap integration
- Google Maps integration
- Place search and filtering
- Reverse geocoding

### RecommendationService
- Mood-based scoring
- Preference matching
- Itinerary generation
- Time-based recommendations

### UberService
- Deep link generation
- Fare estimation
- Product availability
- Ride planning

## Configuration

### Environment Variables

```bash
# Server
NODE_ENV=development
PORT=5001
FRONTEND_URL=http://localhost:3000

# APIs
GOOGLE_MAPS_API_KEY=your_key_here
UBER_CLIENT_ID=your_client_id
UBER_CLIENT_SECRET=your_client_secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### API Keys Setup

1. **Google Maps API**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Places API and Maps API
   - Create API key and add to `.env`

2. **Uber API** (Optional)
   - Go to [Uber Developer](https://developer.uber.com/)
   - Create app and get client credentials
   - Add to `.env` file

## Frontend Integration

### React/Next.js Example

```javascript
// Update location
const updateLocation = async (lat, lng) => {
  const response = await fetch('/api/location/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: 'user123',
      latitude: lat,
      longitude: lng
    })
  });
  return response.json();
};

// Get recommendations
const getRecommendations = async (location, preferences) => {
  const response = await fetch('/api/recommendations/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userLocation: location,
      preferences: preferences
    })
  });
  return response.json();
};

// Generate Uber ride
const generateUberRide = async (pickup, destination) => {
  const response = await fetch('/api/uber/ride', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pickupLocation: pickup,
      destinationLocation: destination
    })
  });
  return response.json();
};
```

### WebSocket Connection

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5001');

// Send location update
socket.emit('location-update', {
  userId: 'user123',
  latitude: 37.7749,
  longitude: -122.4194
});

// Listen for updates
socket.on('location-updated', (data) => {
  console.log('Location updated successfully');
});
```

## Data Models

### User Preferences
```javascript
{
  mood: 'happy' | 'tired' | 'calm' | 'romantic' | 'sad' | 'excited',
  interests: ['eat', 'relax', 'play', 'sightseeing', 'nature', 'sports', 'events'],
  energyLevel: 0-100,
  budget: number,
  transport: 'walk' | 'bike' | 'car' | 'uber',
  socialMode: 'solo' | 'friends',
  accessibility: ['wheelchair', 'pet', 'kid', 'safe'],
  foodTypes: ['junk', 'home', 'desserts']
}
```

### Place Object
```javascript
{
  id: string,
  name: string,
  category: string,
  latitude: number,
  longitude: number,
  distance: number,
  rating: number,
  priceLevel: 1-4,
  tags: string[],
  source: 'osm' | 'google',
  address: string,
  phone: string,
  website: string,
  openingHours: string,
  wheelchairAccessible: boolean,
  petFriendly: boolean,
  kidFriendly: boolean
}
```

## Testing

```bash
# Run tests
npm test

# Test specific endpoint
curl -X POST http://localhost:5001/api/recommendations/generate \
  -H "Content-Type: application/json" \
  -d '{"userLocation":{"latitude":37.7749,"longitude":-122.4194},"preferences":{"mood":"happy"}}'
```

## Deployment

### Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5001
CMD ["npm", "start"]
```

### Environment Variables for Production
```bash
NODE_ENV=production
PORT=5001
FRONTEND_URL=https://your-frontend-domain.com
GOOGLE_MAPS_API_KEY=your_production_key
UBER_CLIENT_ID=your_production_client_id
UBER_CLIENT_SECRET=your_production_client_secret
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Check the API documentation
- Review the example implementations
