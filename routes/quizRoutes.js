const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/', quizController.getAllQuizzes);
router.post('/', requireAuth, quizController.createQuiz);
router.post('/:quizId/questions', requireAuth, quizController.addQuestion);
router.get('/:quizId/questions', quizController.getQuestions);
router.post('/:quizId/submit', requireAuth, quizController.submitAnswers);

module.exports = router;
