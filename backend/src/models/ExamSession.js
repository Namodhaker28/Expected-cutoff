const mongoose = require('mongoose');

const examSessionSchema = new mongoose.Schema(
  {
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    date: { type: Date, required: true },
    shift: { type: String, required: true },
    difficultyAggregate: { type: Number, default: 0 },
    submissionCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

examSessionSchema.index({ examId: 1, date: 1, shift: 1 }, { unique: true });

module.exports = mongoose.model('ExamSession', examSessionSchema);
