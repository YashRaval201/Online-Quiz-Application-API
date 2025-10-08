const Quiz = require('../models/Quiz');
const { evaluateTextAnswer } = require('./geminiService');

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

const Submission = require('../models/Submission');

// Submit answers
async function submitAnswers(quizId, answers, userId) {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new Error('Quiz not found');

  let score = 0;
  const detailedResults = [];

  for (const q of quiz.questions) {
    const ans = answers.find(a => a.questionId === q._id.toString());
    if (!ans) {
      detailedResults.push({
        questionId: q._id.toString(),
        isCorrect: false,
        feedback: 'No answer provided'
      });
      continue;
    }

    let isCorrect = false;
    let feedback = '';

    if (q.type === 'single' && ans.selected === q.correct) {
      isCorrect = true;
      feedback = 'Correct answer';
    } else if (q.type === 'multiple') {
      const correct = JSON.stringify(q.correct.sort());
      const selected = JSON.stringify(ans.selected.sort());
      isCorrect = (correct === selected);
      feedback = isCorrect ? 'All correct options selected' : 'Incorrect selection';
    } else if (q.type === 'text') {
      // Use Gemini AI for text evaluation
      try {
        const evaluation = await evaluateTextAnswer(q.text, ans.selected, q.wordLimit || 300);
        isCorrect = evaluation.isCorrect;
        feedback = evaluation.feedback;
      } catch (error) {
        console.error('Text evaluation error:', error);
        // Fallback to basic word count check
        const wordCount = ans.selected.split(' ').length;
        isCorrect = wordCount <= (q.wordLimit || 300) && ans.selected.trim().length > 0;
        feedback = isCorrect ? 'Answer within word limit' : 'Answer exceeds word limit or is empty';
      }
    }

    if (isCorrect) score++;

    detailedResults.push({
      questionId: q._id.toString(),
      isCorrect,
      feedback
    });
  }

  // Persist submission if userId is provided
  if (userId) {
    try {
      await Submission.create({
        userId,
        quizId,
        answers,
        detailedResults,
        score,
        total: quiz.questions.length
      });
    } catch (_err) {
      // Do not block response on persistence errors
      console.error('Failed to save submission:', _err.message);
    }
  }

  return {
    score,
    total: quiz.questions.length,
    detailedResults
  };
}

module.exports = {
  createQuiz,
  getAllQuizzes,
  addQuestion,
  getQuestions,
  submitAnswers
};
