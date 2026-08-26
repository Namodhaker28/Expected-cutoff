require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

const examRoutes = require('./routes/exams');
const submissionRoutes = require('./routes/submissions');
const authRoutes = require('./routes/auth');

const app = express();

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    const allowed = [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'https://expected-cutoff.vercel.app',
    ].filter(Boolean);
    const isAllowed =
      allowed.includes(origin) ||
      /^https:\/\/[\w-]+\.vercel\.app$/.test(origin);
    callback(null, isAllowed || process.env.NODE_ENV !== 'production');
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.set('trust proxy', 1);

let dbPromise = null;
let dbConnectedLogged = false;

function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return Promise.resolve();
  }
  if (!dbPromise) {
    const uri = process.env.MONGODB_URI;
    dbPromise = mongoose.connect(uri).then(() => {
      if (!dbConnectedLogged) {
        const { host, name } = mongoose.connection;
        console.log(`MongoDB connected successfully `);
        dbConnectedLogged = true;
      }
    });
  }
  return dbPromise;
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

const submissionLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many submissions, please try again later' },
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/exams', examRoutes);
app.use('/api/submissions', submissionLimiter, submissionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', authRoutes);

module.exports = app;
module.exports.connectDB = connectDB;
