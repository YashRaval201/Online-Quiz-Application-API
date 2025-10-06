const quizService = require('../services/quizService');

exports.createQuiz = (req, res) => {
    const { title } = req.body;
    const quiz = quizService.createQuiz(title);
    res.json(quiz);
};

exports.getAllQuizzes = (req, res) => {
    const quizzes = quizService.getAllQuizzes();
    res.json(quizzes);
};

exports.addQuestion = (req, res) => {
    const { quizId } = req.params;
    const question = quizService.addQuestion(quizId, req.body);
    res.json(question);
};

exports.getQuestions = (req, res) => {
    const { quizId } = req.params;
    const questions = quizService.getQuestions(quizId);
    res.json(questions);
};

exports.submitAnswers = (req, res) => {
    const { quizId } = req.params;
    const { answers } = req.body;
    const score = quizService.submitAnswers(quizId, answers);
    res.json(score);
};
