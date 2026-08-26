const mongoose = require('mongoose');

const examSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    categories: [{ type: String }],
    subjects: [{ type: String }],
    maxScore: { type: Number, required: true },
    description: { type: String },
    source: { type: String, enum: ['seed', 'ai'], default: 'seed' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Exam', examSchema);
