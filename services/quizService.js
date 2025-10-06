const Quiz = require('../models/Quiz');

// Create a Quiz
async function createQuiz(title) {
  const quiz = new Quiz({ title, questions: [] });
  return await quiz.save();
}

// Get all quizzes
async function getAllQuizzes() {
  return await Quiz.find();
}

// Add a question
async function addQuestion(quizId, question) {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new Error('Quiz not found');

  quiz.questions.push(question);
  await quiz.save();
  return quiz;
}

// Get questions (without correct answers)
async function getQuestions(quizId) {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new Error('Quiz not found');

  return quiz.questions.map(q => {
    const qObj = q.toObject();
    delete qObj.correct;
    return qObj;
  });
}

// Submit answers
async function submitAnswers(quizId, answers) {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new Error('Quiz not found');

  let score = 0;
  quiz.questions.forEach(q => {
    const ans = answers.find(a => a.questionId === q._id.toString());
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

module.exports = {
  createQuiz,
  getAllQuizzes,
  addQuestion,
  getQuestions,
  submitAnswers
};
