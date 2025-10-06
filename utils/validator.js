function validateQuestion(question) {
    const { type, options, correct, text, wordLimit } = question;
    if (!text) throw new Error('Question text is required');

    if (type === 'single') {
        if (!options || options.length < 2) throw new Error('At least 2 options required');
        if (!correct) throw new Error('Correct option required');
    }

    if (type === 'multiple') {
        if (!options || options.length < 2) throw new Error('At least 2 options required');
        if (!Array.isArray(correct) || correct.length === 0) throw new Error('Correct options required');
    }

    if (type === 'text') {
        if (text.length > (wordLimit || 300)) throw new Error('Text exceeds word limit');
    }
}

module.exports = { validateQuestion };
