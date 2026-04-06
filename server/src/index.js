const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const ideasRouter = require('./routes/ideas');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = (process.env.CLIENT_URL || '*')
  .split(',')
  .map((origin) => origin.trim());
app.use(cors({ origin: allowedOrigins.includes('*') ? '*' : allowedOrigins }));
app.use(express.json({ limit: '1mb' }));

// Routes
app.use('/ideas', ideasRouter);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'InfluenceIQ API is running 🚀' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// Error handler
app.use(errorHandler);

async function connectWithRetry() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    setTimeout(connectWithRetry, 5000);
  }
}

// Start server even if DB is temporarily unavailable.
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
connectWithRetry();