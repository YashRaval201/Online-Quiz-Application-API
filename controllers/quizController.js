const quizService = require('../services/quizService');

exports.createQuiz = async (req, res) => {
  try {
    const quiz = await quizService.createQuiz(req.body.title);
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await quizService.getAllQuizzes();
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addQuestion = async (req, res) => {
  try {
    const { quizId } = req.params;
    const question = await quizService.addQuestion(quizId, req.body);
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const { quizId } = req.params;
    const questions = await quizService.getQuestions(quizId);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.submitAnswers = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body;
    const score = await quizService.submitAnswers(quizId, answers);
    res.json(score);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
