# FitBot AI

FitBot is a full-stack personal fitness assistant for home workouts, whole-food nutrition, progress tracking, and profile-aware AI coaching.

---

## Features

- **Personal onboarding**: Captures name, age, gender, height, weight, target weight, BMI, fitness level, goals, training days, exercise capacity, and dietary preference.
- **Dashboard**: Shows today's workout, BMI, current streak, hydration, quick actions, and personalized plan status.
- **Functional workout planner**: Browse each weekday, start a session, mark individual exercises complete, open exercise details, complete today's workout, and update the streak.
- **Diet planner**: Displays personalized whole-food meals, calories, protein targets, key food sources, dietary preference tabs, and daily meal logging.
- **Full-page AI Coach**: Uses profile context, workout-program references, exercise instructions, and chat history to answer workout, form, nutrition, and recovery questions.
- **Exercise Library**: Search and filter the project exercise dataset by body part, target muscle, search term, and bodyweight equipment.
- **Progress tracking**: Persists water intake, workout completion dates, meal completion, exercise completion, streaks, session totals, and journal notes.
- **Responsive navigation**: Desktop collapsible sidebar, mobile bottom navigation, scrolling disclaimer banner, and a full-width AI Coach workspace.
- **Profile persistence**: User profile, onboarding state, generated plans, and progress are stored locally and synchronized with the backend when available.

---

## Technology Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, Cors, Dotenv
- **AI provider**: Google Gemini REST API with a structured local fallback engine
- **Python model**: Python 3 standard-library retrieval model for exercise matching
- **Persistence**: MongoDB backend storage plus browser localStorage for offline-friendly user data and progress

---

## Quick Start

### Backend

```bash
cd backend
npm install
npm start
```

The backend runs at `http://localhost:5000` and requires a reachable MongoDB instance.

### Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The Vite frontend runs at `http://localhost:3000`.

### Python model

Python 3 is used by the AI exercise retrieval model. No third-party Python packages are required.

```bash
py -3 backend/python_model/exercise_model.py
```

If Python is unavailable, the Node.js dataset search is used automatically.

---

## Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
GEMINI_API_KEY=your_google_gemini_api_key_here
GEMINI_MODEL=gemini-3.6-flash
MONGODB_URI=mongodb://localhost:27017/fitbot
EXERCISES_CSV_PATH=../dataset/exercises.csv
DIET_DATASET_PATH=../dataset/diet.csv
PYTHON_BIN=py
```

- `GEMINI_API_KEY` is optional. Without it, the local structured response engine is used.
- `EXERCISES_CSV_PATH` overrides the default `dataset/exercises.csv` path.
- `DIET_DATASET_PATH` overrides the default `dataset/diet.csv` path.
- `PYTHON_BIN` can point to a specific Python executable, such as `py`, `python`, or an absolute path.

## Datasets

### `dataset/exercises.csv`

ExerciseDB-style reference data containing exercise names, body parts, equipment, target muscles, secondary muscles, instructions, and GIF URLs. It powers Exercise Library search and grounded AI form guidance.

### `dataset/diet.csv`

Despite its filename, this is a workout-program dataset. It contains program titles, descriptions, levels, goals, equipment, duration, and exercise counts. It is used as reference context for AI workout-plan generation, not for meal recommendations.

The Diet Planner's nutrition data currently comes from the structured plans in `backend/data/fitnessData.js`.

---

## API Endpoints

- `GET  /api/health` - Backend health status & AI connection check
- `POST /api/chat` - Send user message and get structured AI response
- `GET  /api/chat/history?email=...` - Retrieve user-scoped chat history
- `DELETE /api/chat/history?email=...` - Clear user-scoped chat history
- `GET  /api/workouts` - Get weekly workout routines by goal
- `GET  /api/workouts/today` - Get today's workout focus
- `GET  /api/diet/:preference` - Get meal plans by dietary preference
- `GET  /api/exercises` - Search and filter exercise library
- `GET  /api/users` - Get user profile
- `POST /api/users` - Update user profile

## Data and Safety Notes

- Browser localStorage is used for local accounts and progress. It is not a replacement for production authentication.
- Backend profile and plan synchronization is best-effort so the app remains usable offline.
- Chat history is scoped by user email in the current in-memory backend store and is cleared when the server restarts.
- Dataset records are reference material. AI responses remain informational and should not replace professional medical or fitness advice.

---

## Disclaimer

Fitness and nutrition suggestions provided by FitBot AI are for general informational purposes only. Always consult a qualified physician or certified fitness professional before initiating a new diet or exercise regimen.