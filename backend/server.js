require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const ticketRoutes = require('./routes/tickets');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'DeskFlow API is running', status: 'ok' });
});

// Routes
app.use('/tickets', ticketRoutes);

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`DeskFlow API server running on port ${PORT}`);
});
