const express = require('express');
const Exam = require('../models/Exam');
const ExamSession = require('../models/ExamSession');
const Submission = require('../models/Submission');
const { hashIp, optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/', optionalAuth, async (req, res) => {
  try {
    const { examSlug, sessionId, category, rawScore, difficultyBySubject, overallDifficulty } = req.body;

    if (!examSlug || !sessionId || !category || rawScore === undefined || !overallDifficulty) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const exam = await Exam.findOne({ slug: examSlug });
    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    const session = await ExamSession.findById(sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const clampedScore = Math.min(Math.max(Number(rawScore), 0), exam.maxScore);
    const ipHash = hashIp(req.ip || req.connection.remoteAddress || 'unknown');

    if (!req.user) {
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const existing = await Submission.findOne({
        ipHash,
        examId: exam._id,
        sessionId,
        createdAt: { $gte: dayAgo },
      });
      if (existing) {
        return res.status(429).json({ error: 'You can only submit once per exam session per day' });
      }
    }

    const submission = await Submission.create({
      examId: exam._id,
      sessionId,
      userId: req.user?.id || null,
      category,
      rawScore: clampedScore,
      difficultyBySubject,
      overallDifficulty: Number(overallDifficulty),
      ipHash,
    });

    await ExamSession.findByIdAndUpdate(sessionId, {
      $inc: { submissionCount: 1 },
      $set: {
        difficultyAggregate: await Submission.aggregate([
          { $match: { sessionId: session._id } },
          { $group: { _id: null, avg: { $avg: '$overallDifficulty' } } },
        ]).then((r) => r[0]?.avg || 0),
      },
    });

    res.status(201).json(submission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
