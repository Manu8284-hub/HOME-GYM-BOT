// ============================================================
// MOCK DATA — all data used for UI demonstration
// Replace with real API calls marked // TODO: connect backend
// ============================================================

export const MOCK_EXERCISES = [
  { id: 'ex-001', name: 'Push-ups', category: 'Chest', muscle: 'Pectorals', difficulty: 'Beginner', sets: 3, reps: '12-15', rest: '60s', instructions: 'Start in high plank. Lower chest to floor, push back up.', commonMistakes: 'Sagging hips, flared elbows', bodyweightAlt: 'Knee Push-ups', alternatives: ['Knee Push-ups', 'Incline Push-ups'] },
  { id: 'ex-002', name: 'Pull-ups', category: 'Back', muscle: 'Latissimus Dorsi', difficulty: 'Intermediate', sets: 3, reps: '6-10', rest: '90s', instructions: 'Dead hang, pull chin above bar, lower controlled.', commonMistakes: 'Kipping, not going full ROM', bodyweightAlt: 'Doorframe Row', alternatives: ['Negative Pull-ups', 'Band-assisted'] },
  { id: 'ex-003', name: 'Bodyweight Squat', category: 'Legs', muscle: 'Quadriceps', difficulty: 'Beginner', sets: 4, reps: '15-20', rest: '60s', instructions: 'Feet shoulder-width. Sit back and down. Drive through heels.', commonMistakes: 'Knees caving, heels lifting', bodyweightAlt: 'Wall Sit', alternatives: ['Wall Sit', 'Split Squat'] },
  { id: 'ex-004', name: 'Plank', category: 'Core', muscle: 'Transverse Abdominis', difficulty: 'Beginner', sets: 3, reps: '30-60s', rest: '45s', instructions: 'Forearms on floor. Straight line from head to heels.', commonMistakes: 'Hips too high or sagging', bodyweightAlt: 'Knee Plank', alternatives: ['Side Plank', 'Dead Bug'] },
  { id: 'ex-005', name: 'Burpees', category: 'Cardio', muscle: 'Full Body', difficulty: 'Advanced', sets: 3, reps: '10', rest: '90s', instructions: 'Squat, jump back to plank, push-up, jump forward, jump up.', commonMistakes: 'Rushing, no full extension', bodyweightAlt: 'Step-back Burpee', alternatives: ['Mountain Climbers', 'Jump Squats'] },
  { id: 'ex-006', name: 'Tricep Dips', category: 'Triceps', muscle: 'Triceps Brachii', difficulty: 'Beginner', sets: 3, reps: '10-15', rest: '60s', instructions: 'Hands on chair edge. Lower hips until elbows 90°, push up.', commonMistakes: 'Going too low, shoulder injury risk', bodyweightAlt: 'Chair Dips', alternatives: ['Diamond Push-ups'] },
  { id: 'ex-007', name: 'Lunges', category: 'Legs', muscle: 'Glutes & Quads', difficulty: 'Beginner', sets: 3, reps: '12 each', rest: '60s', instructions: 'Step forward, lower back knee toward floor. Keep front knee over ankle.', commonMistakes: 'Knee past toes, trunk leaning', bodyweightAlt: 'Reverse Lunge', alternatives: ['Split Squat', 'Step-up'] },
  { id: 'ex-008', name: 'Pike Push-ups', category: 'Shoulders', muscle: 'Deltoids', difficulty: 'Intermediate', sets: 3, reps: '8-12', rest: '75s', instructions: 'Hips high in inverted V. Lower head toward floor, push back up.', commonMistakes: 'Not going deep enough', bodyweightAlt: 'Wall Push-up', alternatives: ['Handstand Hold'] },
  { id: 'ex-009', name: 'Mountain Climbers', category: 'Cardio', muscle: 'Core & Hip Flexors', difficulty: 'Intermediate', sets: 3, reps: '30s', rest: '45s', instructions: 'High plank. Drive knees alternately to chest at speed.', commonMistakes: 'Bouncing hips, slow pace', bodyweightAlt: 'Slow March', alternatives: ['Bicycle Crunch'] },
  { id: 'ex-010', name: 'Glute Bridge', category: 'Glutes', muscle: 'Gluteus Maximus', difficulty: 'Beginner', sets: 3, reps: '15-20', rest: '45s', instructions: 'Lie on back, feet flat. Drive hips up, squeeze glutes at top.', commonMistakes: 'Arching lower back', bodyweightAlt: 'Single-leg Bridge', alternatives: ['Hip Thrust'] },
  { id: 'ex-011', name: 'Bicycle Crunch', category: 'Core', muscle: 'Obliques', difficulty: 'Beginner', sets: 3, reps: '20 each', rest: '45s', instructions: 'Lie back. Pedal legs, touch opposite elbow to knee.', commonMistakes: 'Pulling neck, rushing', bodyweightAlt: 'Dead Bug', alternatives: ['Russian Twist'] },
  { id: 'ex-012', name: 'Jump Squat', category: 'Legs', muscle: 'Quadriceps & Glutes', difficulty: 'Intermediate', sets: 3, reps: '10', rest: '75s', instructions: 'Squat down, explode upward, land softly.', commonMistakes: 'Hard landing, knees caving', bodyweightAlt: 'Regular Squat', alternatives: ['Box Jump'] },
];

export const MOCK_ACHIEVEMENTS = [
  { id: 'ach-001', name: 'First Rep', desc: 'Complete your first workout', icon: '💪', unlocked: true,  xp: 50,  rarity: 'common' },
  { id: 'ach-002', name: 'Week Warrior', desc: '7-day streak', icon: '🔥', unlocked: true,  xp: 150, rarity: 'rare' },
  { id: 'ach-003', name: 'Iron Mind', desc: 'Complete 30 workouts', icon: '🧠', unlocked: false, xp: 300, rarity: 'epic' },
  { id: 'ach-004', name: 'Beast Unleashed', desc: 'Trigger Beast Mode', icon: '😤', unlocked: true,  xp: 200, rarity: 'legendary' },
  { id: 'ach-005', name: 'Centurion', desc: '100 push-ups in a day', icon: '🏆', unlocked: false, xp: 500, rarity: 'legendary' },
  { id: 'ach-006', name: 'Hydrated', desc: 'Hit water goal 7 days', icon: '💧', unlocked: true,  xp: 100, rarity: 'common' },
  { id: 'ach-007', name: 'Night Owl', desc: 'Workout after 10 PM', icon: '🦉', unlocked: false, xp: 75,  rarity: 'common' },
  { id: 'ach-008', name: 'AI Whisperer', desc: 'Chat with AI 20 times', icon: '🤖', unlocked: false, xp: 100, rarity: 'rare' },
];

export const MOCK_WEEKLY_HEATMAP = [
  // last 5 weeks, Mon-Sun
  [4,0,3,5,2,0,4],[3,5,0,4,3,1,0],
  [5,4,2,0,5,3,2],[0,3,5,4,0,2,5],
  [5,4,3,2,5,0,0],
];

export const MOCK_PROGRESS_RINGS = [
  { label: 'Calories', value: 420, target: 600, unit: 'kcal', color: '#C6F135' },
  { label: 'Active Min', value: 35, target: 45, unit: 'min', color: '#00E5FF' },
  { label: 'Workouts', value: 3, target: 5, unit: 'this wk', color: '#FFAA00' },
];

export const MOCK_QUICK_REPLIES = [
  'Swap exercise',
  'Too hard',
  '10-min workout',
  'Warm-up help',
  'Cool-down tips',
];

export const MOCK_EXERCISE_CARD_MSG = {
  type: 'exerciseCard',
  exercise: 'Push-ups',
  sets: 3,
  reps: '12-15',
  restSeconds: 60,
  tips: ['Keep core tight', 'Full range of motion', 'Breathe out on the push'],
};

export const MOCK_CHAT_MESSAGES = [
  {
    id: 'ai-welcome',
    sender: 'ai',
    text: '**Hey! I\'m your AI Coach.**\n\nI\'ve analyzed your profile and built a personalized plan. What do you need today?\n\n* Form tips on any exercise\n* Custom warm-up or cool-down\n* Workout swaps\n* Nutrition guidance',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

export const MOCK_ONBOARDING_STEPS = [
  {
    id: 'goal',
    title: 'What\'s your goal?',
    subtitle: 'Choose what drives you',
    options: [
      { key: 'muscle', label: 'Build Muscle', emoji: '💪' },
      { key: 'fat', label: 'Fat Loss', emoji: '🔥' },
      { key: 'endurance', label: 'Endurance', emoji: '🏃' },
      { key: 'recomp', label: 'Body Recomp', emoji: '⚡' },
    ],
  },
  {
    id: 'level',
    title: 'Your experience?',
    subtitle: 'Be honest — we\'ll scale to you',
    options: [
      { key: 'beginner', label: 'Beginner', emoji: '🌱' },
      { key: 'intermediate', label: 'Intermediate', emoji: '📈' },
      { key: 'advanced', label: 'Advanced', emoji: '🔥' },
    ],
  },
  {
    id: 'equipment',
    title: 'Equipment available?',
    subtitle: 'We work with what you have',
    options: [
      { key: 'none', label: 'No Equipment', emoji: '🏠' },
      { key: 'bands', label: 'Resistance Bands', emoji: '🔗' },
      { key: 'dumbbells', label: 'Dumbbells', emoji: '🏋️' },
      { key: 'full', label: 'Full Gym', emoji: '🏢' },
    ],
  },
  {
    id: 'days',
    title: 'Days per week?',
    subtitle: 'Consistency beats intensity',
    options: [
      { key: '3', label: '3 days', emoji: '📅' },
      { key: '4', label: '4 days', emoji: '📆' },
      { key: '5', label: '5 days', emoji: '🗓️' },
      { key: '6', label: '6 days', emoji: '💥' },
    ],
  },
  {
    id: 'duration',
    title: 'Session length?',
    subtitle: 'Quality over quantity',
    options: [
      { key: '15', label: '15 min', emoji: '⚡' },
      { key: '30', label: '30 min', emoji: '⏱️' },
      { key: '45', label: '45 min', emoji: '🕐' },
      { key: '60', label: '60 min', emoji: '💪' },
    ],
  },
];

export const MOCK_BODY_MUSCLES = [
  { id: 'chest',     label: 'Chest',     volume: 4 },
  { id: 'back',      label: 'Back',      volume: 3 },
  { id: 'shoulders', label: 'Shoulders', volume: 2 },
  { id: 'biceps',    label: 'Biceps',    volume: 2 },
  { id: 'triceps',   label: 'Triceps',   volume: 3 },
  { id: 'core',      label: 'Core',      volume: 5 },
  { id: 'quads',     label: 'Quads',     volume: 4 },
  { id: 'glutes',    label: 'Glutes',    volume: 2 },
  { id: 'hamstrings',label: 'Hamstrings',volume: 1 },
  { id: 'calves',    label: 'Calves',    volume: 1 },
];

export const MOCK_LIVE_WORKOUT = [
  { name: 'Push-ups', sets: 3, reps: 12, rest: 60, muscle: 'Chest' },
  { name: 'Bodyweight Squats', sets: 4, reps: 15, rest: 60, muscle: 'Legs' },
  { name: 'Plank', sets: 3, reps: '45s', rest: 45, muscle: 'Core' },
  { name: 'Glute Bridges', sets: 3, reps: 20, rest: 45, muscle: 'Glutes' },
  { name: 'Mountain Climbers', sets: 3, reps: '30s', rest: 30, muscle: 'Cardio' },
];

export const XP_LEVEL = { current: 1250, nextLevel: 1500, level: 12 };
