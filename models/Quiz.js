const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  id: String,
  text: String
});

const questionSchema = new mongoose.Schema({
  text: String,
  type: { type: String, enum: ['single','multiple','text'] },
  options: [optionSchema],
  correct: mongoose.Schema.Types.Mixed,
  wordLimit: { type: Number, default: 300 }
});

const quizSchema = new mongoose.Schema({
  title: String,
  questions: [questionSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', quizSchema);
