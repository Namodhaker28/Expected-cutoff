const mongoose = require('mongoose');

const historicalCutoffSchema = new mongoose.Schema(
  {
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    year: { type: Number, required: true },
    category: { type: String, required: true },
    openingRank: { type: Number },
    closingRank: { type: Number, required: true },
    openingScore: { type: Number },
    closingScore: { type: Number, required: true },
  },
  { timestamps: true }
);

historicalCutoffSchema.index({ examId: 1, year: 1, category: 1 });

module.exports = mongoose.model('HistoricalCutoff', historicalCutoffSchema);
