const express = require('express');
const bodyParser = require('body-parser');
const quizRoutes = require('./routes/quizRoutes');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use('/quizzes', quizRoutes);

app.listen(PORT, () => {
    console.log(`Quiz API server listening on http://localhost:${PORT}`);
});
