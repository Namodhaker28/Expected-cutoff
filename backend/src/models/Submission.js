const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExamSession', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: { type: String, required: true },
    rawScore: { type: Number, required: true },
    difficultyBySubject: { type: Map, of: Number },
    overallDifficulty: { type: Number, required: true },
    ipHash: { type: String },
  },
  { timestamps: true }
);

submissionSchema.index({ examId: 1, sessionId: 1, category: 1 });
submissionSchema.index({ ipHash: 1, examId: 1, sessionId: 1 });

module.exports = mongoose.model('Submission', submissionSchema);
