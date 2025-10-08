require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
(async () => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
   const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const res = await model.generateContent('Return {"ok":true} only.');
  console.log(res.response.text());
})();