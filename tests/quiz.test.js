const quizService = require('../services/quizService');

describe('Quiz API Tests', () => {
    let quizId;
    let q1, q2, q3;

    test('Create a new quiz', () => {
        const quiz = quizService.createQuiz('Sample Quiz');
        expect(quiz).toHaveProperty('id');
        expect(quiz.title).toBe('Sample Quiz');
        quizId = quiz.id;
    });

    test('Add single choice question', () => {
        q1 = quizService.addQuestion(quizId, {
            text: 'What is 2+2?',
            type: 'single',
            options: [
                { id: 'a', text: '3' },
                { id: 'b', text: '4' }
            ],
            correct: 'b'
        });
        expect(q1).toHaveProperty('id');
        expect(q1.correct).toBe('b');
    });

    test('Add multiple choice question', () => {
        q2 = quizService.addQuestion(quizId, {
            text: 'Select prime numbers',
            type: 'multiple',
            options: [
                { id: 'a', text: '2' },
                { id: 'b', text: '4' },
                { id: 'c', text: '3' }
            ],
            correct: ['a', 'c']
        });
        expect(q2.correct).toEqual(['a', 'c']);
    });

    test('Add text question', () => {
        q3 = quizService.addQuestion(quizId, {
            text: 'Explain Pythagoras theorem',
            type: 'text',
            wordLimit: 50
        });
        expect(q3.text).toBe('Explain Pythagoras theorem');
    });

    test('Get questions without correct answers', () => {
        const questions = quizService.getQuestions(quizId);
        expect(questions[0]).not.toHaveProperty('correct');
        expect(questions.length).toBe(3);
    });

    test('Submit correct answers and check score', () => {
        const score = quizService.submitAnswers(quizId, [
            { questionId: q1.id, selected: 'b' },
            { questionId: q2.id, selected: ['a','c'] },
            { questionId: q3.id, selected: 'It relates sides of right triangle' }
        ]);
        expect(score.score).toBe(3);
        expect(score.total).toBe(3);
    });

    test('Submit wrong answers and check score', () => {
        const score = quizService.submitAnswers(quizId, [
            { questionId: q1.id, selected: 'a' },
            { questionId: q2.id, selected: ['a'] },
            { questionId: q3.id, selected: '' }
        ]);
        expect(score.score).toBe(0);
        expect(score.total).toBe(3);
    });
});
