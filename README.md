# Quiz API

Backend API for creating quizzes, adding questions, retrieving questions (without answers), and submitting answers for scoring. Features JWT-based authentication for secure quiz creation and answer submission.

## Tech Stack
- Node.js + Express 4.x
- MongoDB with Mongoose
- JWT Authentication (jsonwebtoken + bcryptjs)
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

Optional: Set `JWT_SECRET` environment variable for production:
```bash
export JWT_SECRET=your_secure_secret_key
```

## Authentication
The API uses JWT tokens for authentication. Most quiz operations require a valid Bearer token.

### Auth Endpoints
| Method | Endpoint    | Description                    | Auth Required |
| ------ | ----------- | ------------------------------ | ------------- |
| POST   | /auth/register | Register new user            | No            |
| POST   | /auth/login    | Login and get JWT token       | No            |
| GET    | /auth/me       | Get current user info         | Yes           |
| POST   | /auth/logout   | Logout (blacklist token)      | Yes           |

### Quiz Endpoints
| Method | Endpoint                   | Description                                              | Auth Required |
| ------ | -------------------------- | -------------------------------------------------------- | ------------- |
| POST   | /quizzes                   | Create a new quiz                                        | Yes           |
| GET    | /quizzes                   | List all quizzes                                         | No            |
| POST   | /quizzes/:quizId/questions | Add a question to a quiz                                 | Yes           |
| GET    | /quizzes/:quizId/questions | Fetch quiz questions (omits `correct` answers)           | No            |
| POST   | /quizzes/:quizId/submit    | Submit answers and receive `{ score, total }`            | Yes           |

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

### 1. Register User
```
POST /auth/register
Content-Type: application/json

{ "email": "user@example.com", "password": "StrongP@ssw0rd" }
```

### 2. Login
```
POST /auth/login
Content-Type: application/json

{ "email": "user@example.com", "password": "StrongP@ssw0rd" }
```
Response: `{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }`

### 3. Create Quiz (Auth Required)
```
POST /quizzes
Authorization: Bearer <token>
Content-Type: application/json

{ "title": "Sample Quiz" }
```

### 4. Add Question (Auth Required)
```
POST /quizzes/:quizId/questions
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "What is 2+2?",
  "type": "single",
  "options": [ { "id": "a", "text": "3" }, { "id": "b", "text": "4" } ],
  "correct": "b"
}
```

### 5. Get Questions (Public)
```
GET /quizzes/:quizId/questions
```

### 6. Submit Answers (Auth Required)
```
POST /quizzes/:quizId/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "answers": [
    { "questionId": "<id>", "selected": "b" },
    { "questionId": "<id>", "selected": ["a","c"] },
    { "questionId": "<id>", "selected": "Free text within word limit" }
  ]
}
```

### 7. Logout (Auth Required)
```
POST /auth/logout
Authorization: Bearer <token>
```

## Validation
`utils/validator.js` contains validation helpers used for question structure and word limits.

## Project Structure
```
controllers/
  quizController.js
  authController.js
models/
  Quiz.js
  User.js
routes/
  quizRoutes.js
  authRoutes.js
services/
  quizService.js
  authService.js
middleware/
  authMiddleware.js
utils/
  validator.js
  tokenBlacklist.js
db.js
server.js
```

## Testing
`npm test` runs Jest. Tests may require alignment with the current async, MongoDB-backed service. Ensure MongoDB is running, and adapt tests if needed.

## Low-Level Design (LLD)

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client        │    │   Express API   │    │   MongoDB       │
│   (Postman)     │◄──►│   Server        │◄──►│   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   JWT Auth      │
                       │   Middleware    │
                       └─────────────────┘
```

### Authentication Flow
```
1. POST /auth/register
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │   Client    │───►│   Express   │───►│   MongoDB   │
   │             │    │   Server    │    │   (Users)   │
   └─────────────┘    └─────────────┘    └─────────────┘

2. POST /auth/login
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │   Client    │───►│   Express   │───►│   MongoDB   │
   │             │◄───│   Server    │◄───│   (Users)   │
   └─────────────┘    └─────────────┘    └─────────────┘
         │                   │
         │                   ▼
         │            ┌─────────────┐
         │            │   JWT Token  │
         └────────────│   Generated  │
                      └─────────────┘
```

### Quiz Operations Flow
```
3. POST /quizzes (Auth Required)
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │   Client    │───►│   Auth      │───►│   MongoDB   │
   │   (Token)   │    │   Middleware│    │   (Quizzes) │
   └─────────────┘    └─────────────┘    └─────────────┘

4. POST /quizzes/:id/questions (Auth Required)
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │   Client    │───►│   Auth      │───►│   MongoDB   │
   │   (Token)   │    │   Middleware│    │   (Quizzes) │
   └─────────────┘    └─────────────┘    └─────────────┘

5. POST /quizzes/:id/submit (Auth Required)
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │   Client    │───►│   Auth      │───►│   MongoDB   │
   │   (Token)   │    │   Middleware│    │   (Quizzes) │
   └─────────────┘    └─────────────┘    └─────────────┘
```

### Data Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Request   │───►│   Routes    │───►│ Controller  │───►│   Service   │
│             │    │             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                              │
                                                              ▼
                                                       ┌─────────────┐
                                                       │   MongoDB    │
                                                       │   Database   │
                                                       └─────────────┘
```

### Security Features
- JWT tokens with expiration (1 hour)
- Password hashing with bcryptjs
- Token blacklisting for logout
- Auth middleware protecting sensitive operations
- Input validation for questions and answers
