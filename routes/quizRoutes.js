const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// Quiz management
router.post('/', quizController.createQuiz);
router.get('/', quizController.getAllQuizzes);
router.post('/:quizId/questions', quizController.addQuestion);

// Quiz taking
router.get('/:quizId/questions', quizController.getQuestions);
router.post('/:quizId/submit', quizController.submitAnswers);

module.exports = router;
