import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export async function sendChatMessage(message, userProfile) {
  try {
    const res = await API.post('/chat', { message, userProfile });
    return res.data;
  } catch (err) {
    console.error('API sendChatMessage error:', err);
    throw err;
  }
}

export async function getChatHistory() {
  try {
    const res = await API.get('/chat/history');
    return res.data;
  } catch (err) {
    console.error('API getChatHistory error:', err);
    return { history: [] };
  }
}

export async function clearChatHistory() {
  try {
    const res = await API.delete('/chat/history');
    return res.data;
  } catch (err) {
    console.error('API clearChatHistory error:', err);
    throw err;
  }
}

export async function getWorkouts(goal = 'Muscle Gain') {
  try {
    const res = await API.get(`/workouts?goal=${encodeURIComponent(goal)}`);
    return res.data;
  } catch (err) {
    console.error('API getWorkouts error:', err);
    throw err;
  }
}

export async function getTodayWorkout(goal = 'Muscle Gain') {
  try {
    const res = await API.get(`/workouts/today?goal=${encodeURIComponent(goal)}`);
    return res.data;
  } catch (err) {
    console.error('API getTodayWorkout error:', err);
    throw err;
  }
}

export async function getDietPlan(preference = 'Vegetarian') {
  try {
    const res = await API.get(`/diet/${encodeURIComponent(preference)}`);
    return res.data;
  } catch (err) {
    console.error('API getDietPlan error:', err);
    throw err;
  }
}

export async function getExercises(category = 'All', search = '', bodyweightOnly = false) {
  try {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    if (bodyweightOnly) params.append('bodyweightOnly', 'true');

    const res = await API.get(`/exercises?${params.toString()}`);
    return res.data;
  } catch (err) {
    console.error('API getExercises error:', err);
    throw err;
  }
}

export async function signupUser(payload) {
  try {
    const res = await API.post('/users/signup', payload);
    return res.data;
  } catch (err) {
    console.error('API signupUser error:', err);
    throw err.response?.data || err;
  }
}

export async function loginUser(payload) {
  try {
    const res = await API.post('/users/login', payload);
    return res.data;
  } catch (err) {
    console.error('API loginUser error:', err);
    throw err.response?.data || err;
  }
}

export async function getUserProfile() {
  try {
    const res = await API.get('/users');
    return res.data;
  } catch (err) {
    console.error('API getUserProfile error:', err);
    return null;
  }
}

export async function updateUserProfile(profileData) {
  try {
    const res = await API.post('/users', profileData);
    return res.data;
  } catch (err) {
    console.error('API updateUserProfile error:', err);
    throw err;
  }
}

export async function getOrganizedPlan(userProfile) {
  try {
    const res = await API.post('/plan', { userProfile });
    return res.data;
  } catch (err) {
    console.error('API getOrganizedPlan error:', err);
    throw err;
  }
}
