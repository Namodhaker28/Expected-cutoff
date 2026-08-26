require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

const examRoutes = require('./routes/exams');
const submissionRoutes = require('./routes/submissions');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    const allowed = [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'http://127.0.0.1:3000',
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

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/expected-cutoff')
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
