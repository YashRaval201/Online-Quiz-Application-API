const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

router.post('/', quizController.createQuiz);
router.get('/', quizController.getAllQuizzes);
router.post('/quizzes', quizController.createQuiz);
router.post('/:quizId/questions', quizController.addQuestion);
router.get('/:quizId/questions', quizController.getQuestions);
router.post('/:quizId/submit', quizController.submitAnswers);

module.exports = router;
