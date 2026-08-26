require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const Exam = require('../models/Exam');
const HistoricalCutoff = require('../models/HistoricalCutoff');
const SeatMatrix = require('../models/SeatMatrix');
const ExamSession = require('../models/ExamSession');

const DATA_DIR = path.join(__dirname, 'data');

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/expected-cutoff';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  await Promise.all([
    Exam.deleteMany({}),
    HistoricalCutoff.deleteMany({}),
    SeatMatrix.deleteMany({}),
    ExamSession.deleteMany({}),
  ]);
  console.log('Cleared existing data');

  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.json'));

  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf-8'));

    const exam = await Exam.create({
      slug: data.slug,
      name: data.name,
      categories: data.categories,
      subjects: data.subjects,
      maxScore: data.maxScore,
      description: data.description,
    });
    console.log(`Created exam: ${exam.name}`);

    for (const h of data.history) {
      await HistoricalCutoff.create({
        examId: exam._id,
        year: h.year,
        category: h.category,
        closingRank: h.closingRank,
        closingScore: h.closingScore,
        openingRank: h.openingRank,
        openingScore: h.openingScore,
      });
    }

    for (const s of data.seats) {
      await SeatMatrix.create({
        examId: exam._id,
        year: s.year,
        category: s.category,
        totalSeats: s.totalSeats,
        registeredApplicants: s.registeredApplicants,
        appearedApplicants: s.appearedApplicants,
      });
    }

    const today = new Date();
    await ExamSession.create({
      examId: exam._id,
      date: today,
      shift: 'Shift 1 (Morning)',
      difficultyAggregate: 0,
      submissionCount: 0,
    });
    await ExamSession.create({
      examId: exam._id,
      date: today,
      shift: 'Shift 2 (Afternoon)',
      difficultyAggregate: 0,
      submissionCount: 0,
    });
  }

  console.log(`Seeded ${files.length} exams successfully`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
