const quizModel = require('../models/quizModel');
const { validateQuestion } = require('../utils/validator');

function createQuiz(title) {
    return quizModel.createQuiz(title);
}

function getAllQuizzes() {
    return quizModel.getAllQuizzes();
}

function addQuestion(quizId, question) {
    validateQuestion(question);
    return quizModel.addQuestion(quizId, question);
}

function getQuestions(quizId) {
    return quizModel.getQuestions(quizId);
}

function submitAnswers(quizId, answers) {
    return quizModel.submitAnswers(quizId, answers);
}

module.exports = {
    createQuiz,
    getAllQuizzes,
    addQuestion,
    getQuestions,
    submitAnswers
};
