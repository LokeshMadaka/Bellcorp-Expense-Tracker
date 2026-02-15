const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');

const app = express();

// CORS configuration - UPDATED WITH YOUR VERCEL URL
const allowedOrigins = [
  'http://localhost:3000',
  'https://bellcorp-expense-tracker-six.vercel.app',
  'https://bellcorp-expense-tracker-six.vercel.app/login',
  'https://bellcorp-expense-tracker-six.vercel.app/dashboard'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Expense Tracker API',
    status: 'running',
    frontend: 'https://bellcorp-expense-tracker-six.vercel.app'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI not set');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 10000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB error:', err);
    process.exit(1);
  });