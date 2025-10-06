# Quiz API

Backend API for creating quizzes, adding questions, retrieving questions (without answers), and submitting answers for scoring.

## Tech Stack
- Node.js + Express
- MongoDB with Mongoose
- Jest (configured in `package.json`)

## Requirements
- Node.js v18+
- npm v10+
- Running MongoDB instance at `mongodb://localhost:27017/quiz-app` (as configured in `db.js`)

## Getting Started
1. Install dependencies:
   - `npm install`
2. Start the server:
   - `node server.js`
3. Server runs at: `http://localhost:3000`

The server logs each incoming request method and path to the console.

## Configuration
Database connection is defined in `db.js` and currently uses a hardcoded URI:
`mongodb://localhost:27017/quiz-app`.

If you want to customize the connection string, update `db.js` accordingly or load from environment variables.

## API Endpoints
Base path: `/quizzes`

| Method | Endpoint                   | Description                                              |
| ------ | -------------------------- | -------------------------------------------------------- |
| POST   | /quizzes                   | Create a new quiz                                        |
| GET    | /quizzes                   | List all quizzes                                         |
| POST   | /quizzes/:quizId/questions | Add a question to a quiz                                 |
| GET    | /quizzes/:quizId/questions | Fetch quiz questions (omits `correct` answers)           |
| POST   | /quizzes/:quizId/submit    | Submit answers and receive `{ score, total }`            |

Note: There is an additional route definition `POST /quizzes/quizzes` in `routes/quizRoutes.js` due to a duplicate path entry. The documented endpoints above are the intended ones.

## Data Model (Mongoose)
- `Quiz`
  - `title: String`
  - `questions: Question[]`
  - `createdAt: Date`

- `Question`
  - `text: String`
  - `type: 'single' | 'multiple' | 'text'`
  - `options?: { id: String, text: String }[]`
  - `correct: Mixed` (string for single, string[] for multiple, omitted for text)
  - `wordLimit?: Number` (default 300 for text)

## Example Requests

Create quiz
```
POST /quizzes
Content-Type: application/json

{ "title": "Sample Quiz" }
```

Add single-choice question
```
POST /quizzes/:quizId/questions
Content-Type: application/json

{
  "text": "What is 2+2?",
  "type": "single",
  "options": [ { "id": "a", "text": "3" }, { "id": "b", "text": "4" } ],
  "correct": "b"
}
```

Get questions (answers omitted)
```
GET /quizzes/:quizId/questions
```

Submit answers
```
POST /quizzes/:quizId/submit
Content-Type: application/json

{
  "answers": [
    { "questionId": "<id>", "selected": "b" },
    { "questionId": "<id>", "selected": ["a","c"] },
    { "questionId": "<id>", "selected": "Free text within word limit" }
  ]
}
```

## Validation
`utils/validator.js` contains validation helpers used for question structure and word limits.

## Project Structure
```
controllers/
  quizController.js
models/
  Quiz.js
routes/
  quizRoutes.js
services/
  quizService.js
utils/
  validator.js
_db.js
server.js
```

## Testing
`npm test` runs Jest. Tests may require alignment with the current async, MongoDB-backed service. Ensure MongoDB is running, and adapt tests if needed.
