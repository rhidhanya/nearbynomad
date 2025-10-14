const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const locationService = require('./services/locationService');
const placesService = require('./services/placesService');
const recommendationService = require('./services/recommendationService');
const uberService = require('./services/uberService');
const app = express();

// Middleware first
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
};
app.use(require('cors')(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Now mount your routes
app.use('/api/auth', require('./routes/auth'));

// Create HTTP server and socket.io after middleware/routes
const server = createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});


// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/location', require('./routes/location'));
app.use('/api/places', require('./routes/places'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/uber', require('./routes/uber'));

// Socket.io for real-time location updates
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('location-update', async (data) => {
    try {
      const { latitude, longitude, userId } = data;
      
      // Validate location data
      if (!latitude || !longitude || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        socket.emit('error', { message: 'Invalid location data' });
        return;
      }
      
      // Store location update
      await locationService.updateUserLocation(userId, latitude, longitude);
      
      // Emit location update to other clients if needed
      socket.broadcast.emit('user-location-updated', {
        userId,
        latitude,
        longitude,
        timestamp: new Date().toISOString()
      });
      
      socket.emit('location-updated', { success: true });
    } catch (error) {
      console.error('Location update error:', error);
      socket.emit('error', { message: 'Failed to update location' });
    }
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`🚀 NearbyNomad Backend running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

module.exports = { app, server, io };
