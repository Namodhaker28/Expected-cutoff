const HistoricalCutoff = require('../models/HistoricalCutoff');
const SeatMatrix = require('../models/SeatMatrix');
const ExamSession = require('../models/ExamSession');
const Exam = require('../models/Exam');
const { fetchExamDataFromGemini } = require('./geminiService');

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function uniqueSlug(baseSlug) {
  let slug = baseSlug;
  let counter = 1;
  while (await Exam.findOne({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }
  return slug;
}

async function createExamFromAi({ name, description, maxScore, categories }) {
  const aiData = await fetchExamDataFromGemini(name, { description, maxScore, categories });

  const slug = await uniqueSlug(aiData.slug || slugify(name));

  const exam = await Exam.create({
    slug,
    name: aiData.name || name,
    categories: aiData.categories,
    subjects: aiData.subjects,
    maxScore: aiData.maxScore,
    description: aiData.description || description,
    source: 'ai',
  });

  for (const h of aiData.history || []) {
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

  for (const s of aiData.seats || []) {
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
  await ExamSession.create([
    { examId: exam._id, date: today, shift: 'Shift 1 (Morning)' },
    { examId: exam._id, date: today, shift: 'Shift 2 (Afternoon)' },
  ]);

  return exam;
}

module.exports = { createExamFromAi, slugify, uniqueSlug };
