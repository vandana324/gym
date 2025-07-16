require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const logger = require('./config/logger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB(); // handles mongoose.connect

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const businessRoutes = require('./routes/businessRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const authMiddleware = require('./middleware/authMiddleware');

// Public Routes
app.use('/api/auth', authRoutes);

// Protected Routes
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/business', authMiddleware, businessRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/memberships', authMiddleware, membershipRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Debug Info
app.get('/debug', (req, res) => {
  res.json({
    status: 'Server is running',
    mongoUri: process.env.MONGO_URI,
    mongooseState: mongoose.connection.readyState, // 0 = disconnected, 1 = connected
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error Handler
app.use(require('./middleware/errorHandler'));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  console.log(`🚀 Server running on port ${PORT}`);
});
