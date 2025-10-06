const { v4: uuidv4 } = require('uuid');

let quizzes = [];

function createQuiz(title) {
    const quiz = { id: uuidv4(), title, questions: [], createdAt: new Date() };
    quizzes.push(quiz);
    return quiz;
}

function getAllQuizzes() {
    return quizzes;
}

function addQuestion(quizId, question) {
    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) throw new Error('Quiz not found');
    const newQuestion = { id: uuidv4(), ...question };
    quiz.questions.push(newQuestion);
    return newQuestion;
}

function getQuestions(quizId) {
    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) throw new Error('Quiz not found');
    return quiz.questions.map(q => {
        const { correct, ...rest } = q;
        return rest;
    });
}

function submitAnswers(quizId, answers) {
    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) throw new Error('Quiz not found');
    let score = 0;
    quiz.questions.forEach(q => {
        const ans = answers.find(a => a.questionId === q.id);
        if (!ans) return;

        if (q.type === 'single' && ans.selected === q.correct) score++;
        else if (q.type === 'multiple') {
            const correct = JSON.stringify(q.correct.sort());
            const selected = JSON.stringify(ans.selected.sort());
            if (correct === selected) score++;
        } else if (q.type === 'text') {
            if (ans.selected && ans.selected.split(' ').length <= (q.wordLimit || 300)) score++;
        }
    });
    return { score, total: quiz.questions.length };
}

// ✅ Export functions
module.exports = {
    createQuiz,
    getAllQuizzes,
    addQuestion,
    getQuestions,
    submitAnswers
};
