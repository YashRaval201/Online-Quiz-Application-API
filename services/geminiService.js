const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Evaluate a text-based answer using Gemini AI
 * @param {string} question - The question text
 * @param {string} userAnswer - The user's text answer
 * @param {number} wordLimit - Optional word limit for the question
 * @returns {Promise<{isCorrect: boolean, confidence: number, feedback: string}>}
 */
async function evaluateTextAnswer(question, userAnswer, wordLimit = 300) {
  try {
    console.log('🔍 Gemini evaluation started for:', question.substring(0, 50) + '...');
    console.log('🔑 API Key set:', !!process.env.GEMINI_API_KEY);
    
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      throw new Error('Gemini API key not configured');
    }

    // Use gemini-2.5-flash model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
You are an expert quiz evaluator. Evaluate if this student's answer is correct.

Question: "${question}"
Student's Answer: "${userAnswer}"
Word Limit: ${wordLimit} words

Instructions:
- Check if the answer addresses the question properly
- Consider if the answer is factually correct
- Ensure the answer is within the word limit
- Be fair but strict in evaluation

Respond with ONLY one word: "TRUE" if the answer is correct, or "FALSE" if incorrect.
Do not include any other text, explanations, or formatting.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    console.log('🔍 Raw Gemini response:', text);

    // Clean the response - just get the first word
    text = String(text || '').trim().toUpperCase();
    
    // Extract just TRUE or FALSE
    const isCorrect = text.includes('TRUE');
    
    console.log('✅ Gemini evaluation result:', { isCorrect, response: text });

    return {
      isCorrect,
      confidence: isCorrect ? 0.8 : 0.2, // Simple confidence based on result
      feedback: isCorrect ? 'Answer is correct' : 'Answer needs improvement'
    };

  } catch (error) {
    console.error('Gemini API Error:', error && error.message ? error.message : error);
    
    // Fallback: simple word count check for text questions
    const wordCount = userAnswer.split(' ').length;
    const isWithinLimit = wordCount <= wordLimit;
    
    return {
      isCorrect: isWithinLimit && userAnswer.trim().length > 0,
      confidence: isWithinLimit ? 0.5 : 0.0,
      feedback: isWithinLimit 
        ? 'Answer evaluated (Gemini API unavailable - basic validation only)'
        : 'Answer exceeds word limit or is empty'
    };
  }
}

module.exports = { evaluateTextAnswer };
