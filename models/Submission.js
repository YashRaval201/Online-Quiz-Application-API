const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  selected: { type: mongoose.Schema.Types.Mixed, required: true }
}, { _id: false });

const resultSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  feedback: { type: String }
}, { _id: false });

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  answers: { type: [answerSchema], default: [] },
  detailedResults: { type: [resultSchema], default: [] },
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', submissionSchema);


