const express = require('express');
const connectDB = require('./db');
const quizRoutes = require('./routes/quizRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = 3000;

connectDB();

// JSON parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Add this log BEFORE routes
app.use((req, res, next) => {
  console.log(`📩 Incoming Request: ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Handle invalid JSON bodies gracefully
app.use((err, req, res, next) => {
  if (err && err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON', details: err.message });
  }
  return next(err);
});

// Test endpoint to verify JSON parsing
app.post('/test-json', (req, res) => {
  console.log('Test endpoint - Body:', req.body);
  res.json({ received: req.body, bodyType: typeof req.body });
});

app.use('/quizzes', quizRoutes);
app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`✅ Quiz API server listening on http://localhost:${PORT}`);
});
