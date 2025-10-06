const express = require('express');
const connectDB = require('./db');
const quizRoutes = require('./routes/quizRoutes');

const app = express();
const PORT = 3000;

connectDB();

app.use(express.json());

// Add this log BEFORE routes
app.use((req, res, next) => {
  console.log(`📩 Incoming Request: ${req.method} ${req.url}`);
  next();
});

app.use('/quizzes', quizRoutes);

app.listen(PORT, () => {
  console.log(`✅ Quiz API server listening on http://localhost:${PORT}`);
});
