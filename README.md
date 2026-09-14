# FitBot AI - Personal Fitness & Nutrition Assistant

A modern, responsive, full-stack web application built to help users with weekly workout plans, diet suggestions, exercise libraries, progress tracking, and interactive AI fitness coaching.

---

## ⚡ Key Features

- 🏋️ **Monday - Sunday Workout Planner**: Customized splits for Muscle Gain, Fat Loss, and Home Workouts with sets, reps, rest, instructions, common mistakes, and alternatives.
- 🥗 **Diet & Nutrition Planner**: Meal breakdowns for Vegetarian, Non-Vegetarian, Vegan, and Eggetarian preferences with protein & calorie targets.
- 🤖 **Interactive AI Coach**: AI assistant powered by Google Gemini (with smart built-in fallback) that provides structured workout & diet guidance.
- 📚 **Exercise Library**: 40+ searchable exercises categorized by muscle groups (Chest, Back, Shoulders, Biceps, Triceps, Legs, Glutes, Core, Cardio) with bodyweight filters.
- 📊 **Progress & Transformation Tracker**: Track weight trends, hydration (water intake), workout completion, and progress journal notes.
- 👤 **User Fitness Profile**: Customize fitness goals, workout locations, and dietary preferences.

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js, Cors, Dotenv
- **AI Integration**: Google Gemini API via REST with system prompt engineering & structured fallback
- **Database (Phase 2)**: MongoDB & Mongoose support

---

## 🚀 Quick Start Instructions

### 1. Install Backend Dependencies & Start Express Server

```bash
cd backend
npm install
npm start
```
The backend server will run at `http://localhost:5000`.

### 2. Install Frontend Dependencies & Start Vite Dev Server

Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The frontend application will open at `http://localhost:3000`.

---

## 🔑 Environment Variables Setup

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
GEMINI_API_KEY=your_google_gemini_api_key_here
MONGODB_URI=mongodb://localhost:27017/fitbot
```

*Note: If no `GEMINI_API_KEY` is provided, FitBot AI automatically uses its built-in smart AI response engine!*

---

## 📡 API Endpoints

- `GET  /api/health` - Backend health status & AI connection check
- `POST /api/chat` - Send user message and get structured AI response
- `GET  /api/chat/history` - Retrieve chat history
- `DELETE /api/chat/history` - Clear chat history
- `GET  /api/workouts` - Get weekly workout routines by goal
- `GET  /api/workouts/today` - Get today's workout focus
- `GET  /api/diet/:preference` - Get meal plans by dietary preference
- `GET  /api/exercises` - Search and filter exercise library
- `GET  /api/users` - Get user profile
- `POST /api/users` - Update user profile

---

## ⚠️ Disclaimer

Fitness and nutrition suggestions provided by FitBot AI are for general informational purposes only. Always consult a qualified physician or certified fitness professional before initiating a new diet or exercise regimen.