const express = require('express');
const rateLimit = require('express-rate-limit');
const Exam = require('../models/Exam');
const ExamSession = require('../models/ExamSession');
const HistoricalCutoff = require('../models/HistoricalCutoff');
const SeatMatrix = require('../models/SeatMatrix');
const Submission = require('../models/Submission');
const { predict } = require('../services/predictionEngine');
const { createExamFromAi } = require('../services/examCreator');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

const createExamLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Too many exam creation requests. Try again in an hour.' },
});

router.get('/', async (req, res) => {
  try {
    const exams = await Exam.find().select('slug name categories subjects maxScore description source');
    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/create', createExamLimiter, optionalAuth, async (req, res) => {
  try {
    const { name, description, maxScore, categories } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ error: 'Exam name is required' });
    }

    const existing = await Exam.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
    });
    if (existing) {
      return res.status(409).json({
        error: 'An exam with this name already exists',
        slug: existing.slug,
      });
    }

    const exam = await createExamFromAi({
      name: name.trim(),
      description: description?.trim(),
      maxScore: maxScore ? Number(maxScore) : undefined,
      categories: categories?.length ? categories : undefined,
    });

    res.status(201).json({
      exam,
      message: 'Exam created with AI-generated historical data',
    });
  } catch (err) {
    console.error('Exam creation failed:', err.message);
    const status = err.message.includes('GEMINI_API_KEY') ? 503 : 500;
    res.status(status).json({
      error: err.message.includes('GEMINI_API_KEY')
        ? 'AI service is not configured. Add GEMINI_API_KEY to the server.'
        : err.message || 'Failed to create exam',
    });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const exam = await Exam.findOne({ slug: req.params.slug });
    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    const sessions = await ExamSession.find({ examId: exam._id }).sort({ date: -1 });
    res.json({ exam, sessions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:slug/history', async (req, res) => {
  try {
    const exam = await Exam.findOne({ slug: req.params.slug });
    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    const filter = { examId: exam._id };
    if (req.query.category) filter.category = req.query.category;

    const history = await HistoricalCutoff.find(filter).sort({ year: 1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:slug/predict', async (req, res) => {
  try {
    const { category, sessionId } = req.query;
    if (!category) return res.status(400).json({ error: 'category is required' });

    const exam = await Exam.findOne({ slug: req.params.slug });
    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    const submissionFilter = { examId: exam._id, category };
    if (sessionId) submissionFilter.sessionId = sessionId;

    const submissions = await Submission.find(submissionFilter);
    const historyRecords = await HistoricalCutoff.find({ examId: exam._id, category });
    const seatRecords = await SeatMatrix.find({ examId: exam._id, category });

    const result = predict({
      submissions,
      historyRecords,
      seatRecords,
      maxScore: exam.maxScore,
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:slug/stats', async (req, res) => {
  try {
    const { sessionId } = req.query;
    const exam = await Exam.findOne({ slug: req.params.slug });
    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    const filter = { examId: exam._id };
    if (sessionId) filter.sessionId = sessionId;

    const submissions = await Submission.find(filter);
    const avgDifficulty = submissions.length
      ? submissions.reduce((s, sub) => s + sub.overallDifficulty, 0) / submissions.length
      : 0;
    const avgScore = submissions.length
      ? submissions.reduce((s, sub) => s + sub.rawScore, 0) / submissions.length
      : 0;

    res.json({
      submissionCount: submissions.length,
      avgDifficulty: Math.round(avgDifficulty * 100) / 100,
      avgScore: Math.round(avgScore * 100) / 100,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
