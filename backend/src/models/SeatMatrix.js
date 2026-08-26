const mongoose = require('mongoose');

const seatMatrixSchema = new mongoose.Schema(
  {
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    year: { type: Number, required: true },
    category: { type: String, required: true },
    totalSeats: { type: Number, required: true },
    registeredApplicants: { type: Number },
    appearedApplicants: { type: Number },
  },
  { timestamps: true }
);

seatMatrixSchema.index({ examId: 1, year: 1, category: 1 });

module.exports = mongoose.model('SeatMatrix', seatMatrixSchema);
