import dotenv from 'dotenv';
import { workoutPlans, exerciseLibrary, dietPlans } from '../data/fitnessData.js';
import { formatExerciseContext, searchExerciseDataset } from './exerciseDataset.js';
import { formatProgramContext } from './programDataset.js';

dotenv.config();

/**
 * Generate AI Fitness Advice using Google Gemini API or intelligent fallback.
 */
export async function generateFitnessResponse(userQuery, userProfile = {}) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
  const bmiData = calculateBMI(userProfile.height, userProfile.weight);
  const bmi = userProfile.bmi || bmiData.bmi;
  const bmiCategory = userProfile.bmiCategory || bmiData.bmiCategory;
  const fitnessGoal = userProfile.fitnessGoal || 'Build Muscle';
  const exercisePreference = userProfile.exercisePreference || 'Home Bodyweight';
  const exerciseDatasetContext = await formatExerciseContext(userQuery, userProfile);

  const systemInstruction = `
You are FitBot AI, an elite personal fitness trainer, bodyweight coach, and natural whole-food sports nutritionist.

STRICT CORE PRINCIPLES:
1. WORKOUT ENVIRONMENT:
  - HOME WORKOUTS: Must be 100% equipment-free (bodyweight only like push-ups, air squats, chair dips, doorframe rows, planks). Never suggest dumbbells, barbells, or gym machines.

2. NUTRITION & ZERO SUPPLEMENT POLICY:
   - FitBot AI strictly promotes 100% whole-food natural nutrition (especially healthy vegetarian options: paneer, tofu, soya chunks, sprouted moong, lentils, chickpeas, Greek yogurt, seeds, nuts).
   - NEVER promote, recommend, or require artificial supplements, whey protein powders, mass gainers, or synthetic pills. Focus on natural food protein sources.

IMPORTANT FORMAT FOR WORKOUT QUESTIONS:
**Workout Goal**
(Goal & Environment, e.g. Home Bodyweight)

**Exercises**
1. Exercise Name
   * Sets:
   * Reps:
   * Rest:
   * Instructions:

**Tips**
(Key safety & performance tips)

**Alternative Exercise**
(No-equipment bodyweight alternative)

IMPORTANT FORMAT FOR DIET QUESTIONS:
**Meal**
(Meal window, e.g. Breakfast / Post-Workout)

**Natural Food Options**
(100% Whole food natural suggestions - No supplements)

**Approximate Natural Protein**
(Protein breakdown from natural foods)

**Tips**
(Nutrition, hydration, timing tips)

IMPORTANT FORMAT FOR WEEKLY PLAN QUESTIONS:
**Plan Summary**
(One-line overview of the user's goal, BMI, and training style)

**Weekly Split**
(A day-by-day structure matched to the user profile)

**Nutrition Focus**
(Meal priorities and natural food emphasis)

**Adjustment Notes**
(What to do if BMI is low, normal, or high)

DATASET GUIDANCE:
  - Use the verified exercise records below when they match the user's question.
  - Preserve the dataset's target muscles and form instructions, but adapt equipment suggestions to the user's home-only preference.
  - Never invent a GIF URL or claim an exercise is equipment-free when the dataset says otherwise.
`;

  const profileContext = `
User Profile Context:
- Name: ${userProfile.name || 'Friend'}
- Fitness Goal: ${fitnessGoal}
- Exercise Preference: ${exercisePreference}
- Location: ${userProfile.workoutLocation || 'Home'}
- Dietary Preference: ${userProfile.dietaryPreference || 'Vegetarian'}
- Height: ${userProfile.height || 'Unknown'}
- Weight: ${userProfile.weight || 'Unknown'}
- BMI: ${bmi || 'Unknown'}
- BMI Category: ${bmiCategory}
${exerciseDatasetContext ? `\nVerified Exercise Dataset Matches:\n${exerciseDatasetContext}` : ''}
`;

  if (apiKey && apiKey.trim() !== '' && apiKey !== 'your_api_key_here') {
    const model = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemInstruction }]
            },
            contents: [
              {
                role: 'user',
                parts: [
                  { text: `${profileContext}\n\nUser Question: ${userQuery}` }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1200
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) {
          return reply;
        }
        console.error(`Gemini (${model}) returned no text:`, JSON.stringify(data).slice(0, 400));
      } else {
        const errText = await response.text();
        console.error(`Gemini (${model}) HTTP ${response.status}:`, errText.slice(0, 400));
      }
    } catch (err) {
      console.error(`Error calling Gemini (${model}):`, err.message);
    }
    // On any failure above, fall through to the offline engine below.
  }

  // Fallback response engine
  return generateSmartFallbackResponse(userQuery, userProfile);
}

function generateSmartFallbackResponse(query, profile) {
  const q = query.toLowerCase();
  const dietPref = profile.dietaryPreference || 'Vegetarian';
  const fitnessGoal = profile.fitnessGoal || 'Build Muscle';
  const exercisePreference = profile.exercisePreference || 'Home Bodyweight';
  const bmiData = calculateBMI(profile.height, profile.weight);
  const bmi = profile.bmi || bmiData.bmi;
  const bmiCategory = profile.bmiCategory || bmiData.bmiCategory;

  const homeSchedule = workoutPlans['Home Workout'].schedule;
  const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const has = (...words) => words.some(w => q.includes(w));
  const datasetMatches = searchExerciseDataset(query, {
    bodyweightOnly: exercisePreference.toLowerCase().includes('home'),
    limit: 4
  });

  const bmiNote = bmiCategory === 'Underweight'
    ? 'add one extra calorie-dense meal or snack daily to fuel growth.'
    : (bmiCategory === 'Overweight' || bmiCategory === 'Obese')
      ? 'keep portions controlled, cut liquid calories, and add daily walking.'
      : 'keep portions steady and adjust only if your weight stalls.';

  const formatExercises = (list) =>
    list.map((ex, i) =>
`${i + 1}. ${ex.name}
   * Sets: ${ex.sets}
   * Reps: ${ex.reps}
   * Rest: ${ex.rest}
   * Instructions: ${ex.instructions}`).join('\n\n');

  // Full workout block pulled from a real day in the Home schedule.
  const dayWorkout = (dayName) => {
    const day = homeSchedule[dayName];
    if (!day) return null;
    if (day.isRest) {
      return `**Workout Goal**
${dayName} · Rest & Active Recovery (Home)

**Exercises**
Today is a scheduled recovery day — no training load.

**Tips**
* ${day.exercises?.[0]?.instructions || 'Light stretching, mobility, and hydration.'}
* Sleep 7-9 hours — muscle is repaired and built during rest.

**Alternative Exercise**
* ${day.exercises?.[0]?.alternative || 'Light 20-minute walk.'}`;
    }
    return `**Workout Goal**
${dayName} · ${day.focus} — 100% Equipment-Free Home Workout

**Exercises**
${formatExercises(day.exercises)}

**Tips**
* Control every rep — 2-3 seconds on the lowering phase builds the most muscle.
* Rest ${day.exercises[0]?.rest || '45-60 sec'} between sets and stay hydrated.

**Alternative Exercise**
* ${day.exercises[0]?.alternative || 'Swap any move for an easier bodyweight variation.'}`;
  };

  if (datasetMatches.length && !has('diet', 'meal', 'eat', 'food', 'nutrition', 'protein')) {
    const exercise = datasetMatches[0];
    return `**Exercise Guide**
${exercise.name} targets ${exercise.target} and primarily uses ${exercise.equipment}.

**Instructions**
${exercise.instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join('\n')}

**Muscles Worked**
* Primary: ${exercise.target}
* Secondary: ${exercise.secondaryMuscles.join(', ') || 'None listed'}

**Safety Tips**
* Move with control and stop if you feel sharp pain.
* Your current profile is ${fitnessGoal.toLowerCase()} focused with a ${bmiCategory.toLowerCase()} BMI category.`;
  }

  // 1. DIET / NUTRITION
  if (has('diet', 'meal', 'eat', 'food', 'nutrition', 'vegetarian', 'vegan', 'breakfast', 'lunch', 'dinner', 'snack', 'protein')) {
    const dietInfo = dietPlans[dietPref] || dietPlans.Vegetarian;
    return `**Meal**
100% Natural Whole-Food ${dietPref} Meal Guide (Zero Powder Supplements)

**Natural Food Options**
* Breakfast: ${dietInfo.meals.breakfast.title} (${dietInfo.meals.breakfast.options})
* Mid-Morning: ${dietInfo.meals.midMorning.title} (${dietInfo.meals.midMorning.options})
* Lunch: ${dietInfo.meals.lunch.title} (${dietInfo.meals.lunch.options})
* Post-Workout: ${dietInfo.meals.postWorkout.title} (${dietInfo.meals.postWorkout.options})
* Dinner: ${dietInfo.meals.dinner.title} (${dietInfo.meals.dinner.options})

**Approximate Natural Protein**
* Daily Target: ${dietInfo.proteinTarget}
* Key Sources: ${dietInfo.keySources.protein.join(', ')}.

**Tips**
* 100% real whole foods — no artificial powders or supplements needed.
* Spread protein across every meal for the best muscle repair.
* Your BMI is ${bmi || 'Unknown'} (${bmiCategory}) — ${bmiNote}`;
  }

  // 2. WEEKLY PLAN
  if (has('weekly', 'week plan', 'full plan', 'schedule', 'split', 'roadmap', 'organize', 'whole week', 'entire week') || q.trim() === 'plan') {
    return `**Plan Summary**
${profile.name || 'Athlete'}'s plan is centered on ${fitnessGoal.toLowerCase()} with ${exercisePreference.toLowerCase()} training. BMI: ${bmi || 'Unknown'} (${bmiCategory}).

**Weekly Split**
1. Monday - ${homeSchedule.Monday.focus}
2. Tuesday - ${homeSchedule.Tuesday.focus}
3. Wednesday - ${homeSchedule.Wednesday.focus}
4. Thursday - ${homeSchedule.Thursday.focus}
5. Friday - ${homeSchedule.Friday.focus}
6. Saturday - ${homeSchedule.Saturday.focus}
7. Sunday - ${homeSchedule.Sunday.focus}

**Nutrition Focus**
* Build every meal around whole-food protein: paneer, tofu, lentils, chickpeas, curd, seeds.
* Keep protein consistent across the day and hydrate well.

**Adjustment Notes**
* Your BMI is ${bmi || 'Unknown'} (${bmiCategory}) — ${bmiNote}`;
  }

  // 3. A SPECIFIC WEEKDAY (e.g. "Monday workout")
  const namedDay = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].find(d => q.includes(d));
  if (namedDay) {
    return dayWorkout(namedDay.charAt(0).toUpperCase() + namedDay.slice(1));
  }

  // 4. TODAY'S WORKOUT
  if (has('today', "today's", 'todays')) {
    return dayWorkout(WEEKDAYS[new Date().getDay()]);
  }

  // 5. FAT LOSS
  if (has('fat', 'lose', 'weight loss', 'lean', 'cut', 'shred', 'burn', 'slim', 'cardio', 'hiit', 'conditioning')) {
    return `**Workout Goal**
Lose Fat — High-Intensity Home Fat-Burn Circuit (No Equipment)

**Exercises**
1. Burpees
   * Sets: 4
   * Reps: 12
   * Rest: 45 sec
   * Instructions: Squat, kick back to plank, push-up, jump feet in, explode up.

2. Mountain Climbers
   * Sets: 4
   * Reps: 45 sec work
   * Rest: 20 sec
   * Instructions: High plank, drive knees to chest rapidly like sprinting in place.

3. Bodyweight Jump Squats
   * Sets: 4
   * Reps: 15
   * Rest: 45 sec
   * Instructions: Squat deep, explode up off the floor, land soft into the next rep.

4. High Knees
   * Sets: 4
   * Reps: 40 sec
   * Rest: 20 sec
   * Instructions: Run in place driving knees to hip height, stay light on the toes.

5. Bicycle Crunches
   * Sets: 3
   * Reps: 20 total
   * Rest: 30 sec
   * Instructions: Opposite elbow to knee with a 1-second squeeze each rep.

**Tips**
* Run it as a circuit (back-to-back) 3-4x per week to keep your heart rate high.
* Fat loss is won in the kitchen — hold a modest calorie deficit with high-protein, high-fiber whole foods.
* Your BMI is ${bmi || 'Unknown'} (${bmiCategory}) — ${bmiNote}

**Alternative Exercise**
* Replace Burpees with Squat Thrusts (no jump) for lower impact.`;
  }

  // 6. CORE / ABS
  if (has('core', 'abs', 'six pack', 'six-pack', 'belly', 'plank', 'oblique', 'stomach')) {
    return `**Workout Goal**
Core & Abs — Home Bodyweight Circuit (No Equipment)

**Exercises**
1. Forearm Plank
   * Sets: 3
   * Reps: 45-60 sec hold
   * Rest: 45 sec
   * Instructions: Elbows under shoulders, body rigid in a straight line, brace the abs.

2. Bicycle Crunches
   * Sets: 3
   * Reps: 20 total
   * Rest: 30 sec
   * Instructions: Rotate opposite elbow to knee with a controlled 1-second squeeze.

3. Lying Leg Raises
   * Sets: 3
   * Reps: 15
   * Rest: 45 sec
   * Instructions: Legs straight, lower slowly without letting the lower back arch.

4. Mountain Climbers
   * Sets: 3
   * Reps: 40 sec
   * Rest: 30 sec
   * Instructions: Fast, controlled knee drives from a strong high plank.

5. Superman Back Extensions
   * Sets: 3
   * Reps: 15 (2s hold)
   * Rest: 45 sec
   * Instructions: Lift arms and legs off the floor, squeeze the lower back, hold, release.

**Tips**
* Train core 3-4x per week and always pair ab work with lower-back work (Superman) for balance.
* Visible abs come from low body fat — combine this with clean whole-food eating.

**Alternative Exercise**
* Swap Lying Leg Raises for Knee Tucks if your hip flexors fatigue early.`;
  }

  // 7. BUILD MUSCLE / STRENGTH
  if (has('muscle', 'build', 'strength', 'mass', 'bigger', 'hypertrophy', 'gain', 'tone', 'chest', 'arm', 'push', 'grow')) {
    return `**Workout Goal**
Build Muscle — Home Hypertrophy Session (100% Bodyweight, No Equipment)

**Exercises**
1. Standard Push-Ups (Slow Tempo)
   * Sets: 4
   * Reps: 12-15
   * Rest: 60 sec
   * Instructions: 3 seconds down, 1 second up. Keep a rigid plank and full range of motion.

2. Bulgarian Split Squats (Rear foot on chair)
   * Sets: 3
   * Reps: 12 each leg
   * Rest: 60 sec
   * Instructions: Lower the back knee toward the floor, drive up through the front heel.

3. Doorframe / Under-Table Rows
   * Sets: 4
   * Reps: 12-15
   * Rest: 60 sec
   * Instructions: Pull your chest toward your hands, squeeze the shoulder blades together.

4. Pike Push-Ups
   * Sets: 3
   * Reps: 10-12
   * Rest: 60 sec
   * Instructions: Hips high in an inverted V, lower the top of your head toward the floor.

5. Glute Bridges
   * Sets: 3
   * Reps: 20
   * Rest: 45 sec
   * Instructions: Drive the hips high and squeeze the glutes hard for 1 second at the top.

**Tips**
* Train close to failure (leave 1-2 reps in reserve) and add 1-2 reps each week to keep growing.
* Eat natural protein around 1.6-2g per kg of bodyweight: paneer, tofu, lentils, curd, eggs.
* Your BMI is ${bmi || 'Unknown'} (${bmiCategory}) — ${bmiNote}

**Alternative Exercise**
* Swap Pike Push-Ups for Wall-Assisted Pike Push-Ups if your shoulders fatigue.`;
  }

  // 8. DEFAULT: full-body home session
  return `**Workout Goal**
Full-Body Home Workout — 100% Equipment-Free (No Dumbbells)

**Exercises**
1. Standard Push-Ups
   * Sets: 4
   * Reps: 12-15
   * Rest: 60 sec
   * Instructions: Rigid plank position, bend elbows to 90 degrees, push back up.

2. Bodyweight Air Squats
   * Sets: 4
   * Reps: 20
   * Rest: 45 sec
   * Instructions: Sit hips back into the heels with chest up, squat deep, push up.

3. Doorframe Rows
   * Sets: 4
   * Reps: 15
   * Rest: 45 sec
   * Instructions: Grip the doorframe, lean back and pull your chest toward your hands.

4. Glute Bridges
   * Sets: 3
   * Reps: 20
   * Rest: 45 sec
   * Instructions: Drive through the heels, lift hips high, squeeze glutes for 1 second.

5. Forearm Plank
   * Sets: 3
   * Reps: 45-60 sec hold
   * Rest: 45 sec
   * Instructions: Elbows under shoulders, body straight and rigid, brace the abs.

**Tips**
* Aim for 4-5 sessions per week and progress by adding reps or slowing the tempo.
* Fuel recovery with natural whole foods (paneer, tofu, lentils, curd) — no supplements needed.

**Alternative Exercise**
* Any move can be regressed: Knee Push-Ups, Chair Squats, or Knee Planks for beginners.`;
}

/* ===================================================================== */
/*  PERSONALIZED STRUCTURED PLAN GENERATION                              */
/*  Returns a structured object that matches the exact shapes the        */
/*  frontend views render (schedule[day].exercises[] + meals.{6 keys}).  */
/* ===================================================================== */

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const WORKOUT_TEMPLATE_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MEAL_KEYS = ['breakfast', 'midMorning', 'lunch', 'preWorkout', 'postWorkout', 'dinner'];

/**
 * Entry point used by planController. Try Gemini (structured JSON); if it
 * fails for any reason, always fall back to a capacity-scaled plan so the
 * app never breaks.
 */
export async function generateOrganizedPlan(userProfile = {}) {
  const structured = await generateStructuredPlan(userProfile);
  if (structured) return structured;
  return buildFallbackPlan(userProfile);
}

/* ------------------------------- helpers -------------------------------- */

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

function toNumber(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function categoryForBmi(bmi) {
  if (!bmi) return 'Unknown';
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

function resolveBMI(userProfile) {
  if (userProfile.bmi) {
    return {
      bmi: userProfile.bmi,
      bmiCategory: userProfile.bmiCategory || categoryForBmi(userProfile.bmi)
    };
  }
  const h = userProfile.heightCm || userProfile.height;
  const w = userProfile.weightKg || userProfile.weight;
  const data = calculateBMI(h, w);
  return { bmi: data.bmi, bmiCategory: data.bmiCategory };
}

function normalizeCapacities(caps = {}) {
  return {
    pushups: toNumber(caps.pushups, 10),
    squats: toNumber(caps.squats, 15),
    plankSec: toNumber(caps.plankSec, 30),
    dips: toNumber(caps.dips, 8),
    lunges: toNumber(caps.lunges, 10),
    crunches: toNumber(caps.crunches, 15),
    jumpingJacks: toNumber(caps.jumpingJacks, 20),
    skippingSec: toNumber(caps.skippingSec, 30),
    runMinutes: toNumber(caps.runMinutes, 10)
  };
}

/* --------------------------- fallback builder --------------------------- */

function levelFactors(level) {
  switch (level) {
    case 'Beginner': return { rep: 0.4, setAdj: -1, restAdj: 15 };
    case 'Advanced': return { rep: 0.6, setAdj: 1, restAdj: -10 };
    default: return { rep: 0.5, setAdj: 0, restAdj: 0 }; // Intermediate
  }
}

function capForExercise(name = '', caps) {
  const n = name.toLowerCase();
  if (n.includes('dip')) return caps.dips;
  if (n.includes('push')) return caps.pushups; // push-up, pike push-up
  if (n.includes('lunge') || n.includes('split squat')) return caps.lunges;
  if (n.includes('squat')) return caps.squats;
  if (n.includes('crunch') || n.includes('bicycle') || n.includes('sit-up') ||
      n.includes('leg raise') || n.includes('leg lift') || n.includes('knee tuck')) return caps.crunches;
  if (n.includes('burpee') || n.includes('jump') || n.includes('high knee')) return caps.jumpingJacks;
  return null;
}

function scaleRestString(rest, restAdj) {
  const m = String(rest || '').match(/(\d+)/);
  if (!m) return rest; // e.g. "N/A"
  return `${clamp(Number(m[1]) + restAdj, 20, 150)} sec`;
}

function repsSuffix(reps) {
  const r = String(reps).toLowerCase();
  if (r.includes('each leg') || r.includes('each side')) return ' each leg';
  if (r.includes('total')) return ' total';
  return '';
}

function scaleExercise(ex, caps, factors) {
  const next = { ...ex };
  const reps = String(ex.reps || '');
  const lower = reps.toLowerCase();

  next.sets = clamp(toNumber(ex.sets, 3) + factors.setAdj, 2, 6);
  next.rest = scaleRestString(ex.rest, factors.restAdj);

  if (lower.includes('hold')) {
    // Isometric hold — scale from plank capacity.
    const sec = clamp(Math.round(caps.plankSec * (0.5 + factors.rep)), 15, 120);
    next.reps = `${sec} sec hold`;
  } else if (lower.includes('sec') || lower.includes('min')) {
    // Timed work interval — keep as authored.
    next.reps = reps;
  } else {
    const cap = capForExercise(ex.name, caps);
    if (cap && cap > 0) {
      const target = clamp(Math.round(cap * factors.rep), 6, 30);
      const lo = Math.max(5, target - 3);
      next.reps = `${lo}-${target}${repsSuffix(reps)}`;
    } else {
      next.reps = reps; // no mapping — leave as authored
    }
  }
  return next;
}

function restDayBlock() {
  const src = workoutPlans['Home Workout'].schedule.Sunday;
  return {
    focus: 'Rest & Active Recovery',
    isRest: true,
    exercises: src?.exercises ? clone(src.exercises) : []
  };
}

function buildFallbackWorkout(userProfile, caps) {
  const level = userProfile.fitnessLevel || 'Intermediate';
  const factors = levelFactors(level);
  const home = workoutPlans['Home Workout'];
  const availableDays = Array.isArray(userProfile.availableDays) && userProfile.availableDays.length
    ? userProfile.availableDays
    : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const templates = WORKOUT_TEMPLATE_DAYS.map((d) => home.schedule[d]);
  const schedule = {};
  let ti = 0;
  for (const day of ALL_DAYS) {
    if (availableDays.includes(day)) {
      const tpl = clone(templates[ti % templates.length]);
      ti += 1;
      schedule[day] = {
        focus: tpl.focus,
        isRest: false,
        exercises: (tpl.exercises || []).map((ex) => scaleExercise(ex, caps, factors))
      };
    } else {
      schedule[day] = restDayBlock();
    }
  }

  return {
    goal: 'Home Workout',
    description: `100% equipment-free bodyweight plan, auto-scaled to a ${level} level and your current capacity. Training days: ${availableDays.join(', ')}.`,
    schedule
  };
}

function goalCalorieNote(goal, bmiCategory) {
  const g = String(goal || '').toLowerCase();
  if (g.includes('lose') || g.includes('fat') || g.includes('cut') || g.includes('lean')) {
    return 'Slight calorie deficit (~300-400 kcal below maintenance) for steady fat loss.';
  }
  if (g.includes('gain') || g.includes('mass') || g.includes('muscle') || g.includes('bulk')) {
    return 'Slight calorie surplus (~300 kcal above maintenance) to build lean muscle.';
  }
  if (bmiCategory === 'Overweight' || bmiCategory === 'Obese') {
    return 'Hold a mild deficit and prioritise protein and fibre to stay full.';
  }
  if (bmiCategory === 'Underweight') {
    return 'Add one extra calorie-dense whole-food snack daily to support growth.';
  }
  return 'Eat around maintenance and keep protein high across the day.';
}

function buildFallbackDiet(userProfile, bmiCategory) {
  const prefKey = userProfile.dietaryPreference || 'Vegetarian';
  const base = clone(dietPlans[prefKey] || dietPlans.Vegetarian);
  base.calories = `${base.calories} · ${goalCalorieNote(userProfile.fitnessGoal, bmiCategory)}`;
  return base;
}

function buildFallbackPlan(userProfile = {}) {
  const caps = normalizeCapacities(userProfile.capacities);
  const { bmi, bmiCategory } = resolveBMI(userProfile);
  const fitnessGoal = userProfile.fitnessGoal || 'Build Muscle';
  const exercisePreference = userProfile.exercisePreference || 'Home Bodyweight';

  return {
    summary: `${fitnessGoal} focused home plan for a ${userProfile.fitnessLevel || 'Intermediate'} athlete. BMI ${bmi ?? 'n/a'} (${bmiCategory}). 100% bodyweight training and whole-food ${userProfile.dietaryPreference || 'Vegetarian'} nutrition.`,
    workoutPlan: buildFallbackWorkout(userProfile, caps),
    dietPlan: buildFallbackDiet(userProfile, bmiCategory),
    bmi,
    bmiCategory,
    fitnessGoal,
    exercisePreference,
    generatedAt: new Date().toISOString(),
    source: 'fallback'
  };
}

/* ----------------------------- Gemini path ------------------------------ */

function buildPlanPrompt(userProfile, caps, bmi, bmiCategory) {
  const pref = userProfile.dietaryPreference || 'Vegetarian';
  const availableDays = Array.isArray(userProfile.availableDays) && userProfile.availableDays.length
    ? userProfile.availableDays.join(', ')
    : 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday';
  const programContext = formatProgramContext(userProfile);

  return `
Generate a fully personalized ONE-WEEK fitness + nutrition plan as STRICT JSON.

USER:
- Name: ${userProfile.name || 'Athlete'}
- Age: ${userProfile.age || 'n/a'}, Gender: ${userProfile.gender || 'n/a'}
- Height: ${userProfile.heightCm || userProfile.height || 'n/a'} cm, Weight: ${userProfile.weightKg || userProfile.weight || 'n/a'} kg
- BMI: ${bmi ?? 'n/a'} (${bmiCategory})
- Experience level: ${userProfile.fitnessLevel || 'Intermediate'}
- Goal: ${userProfile.fitnessGoal || 'Build Muscle'}
- Dietary preference: ${pref}
- Available training days: ${availableDays}
- Current capacity (max in one set): push-ups ${caps.pushups}, squats ${caps.squats}, plank ${caps.plankSec}s, dips ${caps.dips}, lunges ${caps.lunges}, crunches ${caps.crunches}, jumping jacks ${caps.jumpingJacks}, skipping ${caps.skippingSec}s, continuous running ${caps.runMinutes} min
${programContext ? `\nREFERENCE WORKOUT PROGRAMS FROM DATASET:\n${programContext}` : ''}

HARD RULES:
1. HOME ONLY, 100% equipment-free bodyweight. Never use dumbbells, barbells, bands, or machines.
2. Nutrition is 100% whole-food natural. NEVER include protein powder, mass gainers, or any artificial supplement. Respect the "${pref}" preference strictly.
3. Scale every exercise's sets/reps/rest to the user's capacity and level. A beginner or a 0-capacity user gets easier regressions.
4. Training days (${availableDays}) get real workouts. Every other weekday MUST be a rest day: "isRest": true with light mobility only.
5. Adjust calories/protein for the goal (deficit for fat loss, surplus for muscle/mass gain).

RETURN ONLY THIS JSON SHAPE (no markdown, no commentary):
{
  "summary": "one or two sentence overview",
  "workoutPlan": {
    "goal": "Home Workout",
    "description": "short description",
    "schedule": {
      "Monday": { "focus": "string", "isRest": false, "exercises": [ { "name": "", "muscle": "", "sets": 3, "reps": "12-15", "rest": "60 sec", "difficulty": "Beginner|Intermediate|Advanced", "instructions": "", "commonMistakes": "", "alternative": "" } ] },
      "Tuesday": {}, "Wednesday": {}, "Thursday": {}, "Friday": {}, "Saturday": {}, "Sunday": {}
    }
  },
  "dietPlan": {
    "preference": "${pref}",
    "philosophy": "string",
    "calories": "e.g. 2,200 - 2,400 kcal",
    "proteinTarget": "e.g. 130g - 150g",
    "meals": {
      "breakfast": { "title": "", "calories": "~400 kcal", "protein": "26g", "options": "" },
      "midMorning": {}, "lunch": {}, "preWorkout": {}, "postWorkout": {}, "dinner": {}
    },
    "keySources": { "protein": ["", ""], "carbs": ["", ""], "fats": ["", ""] }
  }
}
All 7 weekday keys and all 6 meal keys (breakfast, midMorning, lunch, preWorkout, postWorkout, dinner) are REQUIRED.`;
}

async function generateStructuredPlan(userProfile) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_api_key_here') return null;

  const caps = normalizeCapacities(userProfile.capacities);
  const { bmi, bmiCategory } = resolveBMI(userProfile);
  const model = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
  const prompt = buildPlanPrompt(userProfile, caps, bmi, bmiCategory);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.6,
            maxOutputTokens: 4096
          }
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Gemini plan (${model}) HTTP ${response.status}:`, errText.slice(0, 300));
      return null;
    }

    const data = await response.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) {
      console.error('Gemini plan returned no text.');
      return null;
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error('Gemini plan JSON parse failed:', e.message);
      return null;
    }

    const normalized = normalizeStructuredPlan(parsed, userProfile);
    if (!normalized) return null;

    return {
      ...normalized,
      bmi,
      bmiCategory,
      fitnessGoal: userProfile.fitnessGoal || 'Build Muscle',
      exercisePreference: userProfile.exercisePreference || 'Home Bodyweight',
      generatedAt: new Date().toISOString(),
      source: 'gemini'
    };
  } catch (err) {
    console.error('Error calling Gemini for plan:', err.message);
    return null;
  }
}

function normalizeExercise(ex = {}) {
  return {
    name: String(ex.name || 'Bodyweight Exercise'),
    muscle: String(ex.muscle || 'Full Body'),
    sets: toNumber(ex.sets, 3),
    reps: String(ex.reps ?? '12-15'),
    rest: String(ex.rest || '60 sec'),
    difficulty: ['Beginner', 'Intermediate', 'Advanced'].includes(ex.difficulty) ? ex.difficulty : 'Beginner',
    instructions: String(ex.instructions || 'Perform with controlled form and a full range of motion.'),
    commonMistakes: String(ex.commonMistakes || 'Rushing the movement or losing form.'),
    alternative: String(ex.alternative || 'Choose an easier bodyweight variation.')
  };
}

/**
 * Validate + normalize the raw Gemini JSON into the exact view shape.
 * Returns null when the core structure is missing (→ triggers fallback).
 */
function normalizeStructuredPlan(raw, userProfile) {
  if (!raw || typeof raw !== 'object') return null;
  const wp = raw.workoutPlan;
  const dp = raw.dietPlan;
  if (!wp || !wp.schedule || typeof wp.schedule !== 'object') return null;
  if (!dp || !dp.meals || typeof dp.meals !== 'object') return null;

  // Workout — guarantee all 7 weekday keys.
  const schedule = {};
  for (const day of ALL_DAYS) {
    const d = wp.schedule[day];
    if (!d || typeof d !== 'object') {
      schedule[day] = restDayBlock();
      continue;
    }
    const exercises = Array.isArray(d.exercises) ? d.exercises.map(normalizeExercise) : [];
    const isRest = Boolean(d.isRest) || exercises.length === 0;
    schedule[day] = {
      focus: String(d.focus || (isRest ? 'Rest & Recovery' : 'Full Body')),
      isRest,
      exercises: exercises.length ? exercises : restDayBlock().exercises
    };
  }

  // Diet — guarantee all 6 meal keys.
  const meals = {};
  for (const key of MEAL_KEYS) {
    const m = dp.meals[key] || {};
    meals[key] = {
      title: String(m.title || 'Whole-Food Meal'),
      calories: String(m.calories || '~400 kcal'),
      protein: String(m.protein || '20g natural protein'),
      options: String(m.options || 'A balanced whole-food plate.')
    };
  }

  const baseDiet = dietPlans[userProfile.dietaryPreference] || dietPlans.Vegetarian;
  const ks = dp.keySources || {};
  const pickSources = (arr, fallbackArr) =>
    Array.isArray(arr) && arr.length ? arr.map(String) : fallbackArr;

  return {
    summary: String(raw.summary || 'Your personalized week is ready.'),
    workoutPlan: {
      goal: 'Home Workout',
      description: String(wp.description || 'Personalized 100% equipment-free bodyweight plan.'),
      schedule
    },
    dietPlan: {
      preference: String(dp.preference || userProfile.dietaryPreference || 'Vegetarian'),
      philosophy: String(dp.philosophy || '100% whole-food natural nutrition. Zero supplements.'),
      calories: String(dp.calories || '2,000 - 2,400 kcal'),
      proteinTarget: String(dp.proteinTarget || '120g - 140g'),
      meals,
      keySources: {
        protein: pickSources(ks.protein, baseDiet.keySources.protein),
        carbs: pickSources(ks.carbs, baseDiet.keySources.carbs),
        fats: pickSources(ks.fats, baseDiet.keySources.fats)
      }
    }
  };
}

function calculateBMI(height, weight) {
  const heightCm = parseMetric(height);
  const weightKg = parseMetric(weight);

  if (!heightCm || !weightKg) {
    return { bmi: null, bmiCategory: 'Unknown' };
  }

  const bmi = Number((weightKg / Math.pow(heightCm / 100, 2)).toFixed(1));
  let bmiCategory = 'Normal weight';

  if (bmi < 18.5) bmiCategory = 'Underweight';
  else if (bmi < 25) bmiCategory = 'Normal weight';
  else if (bmi < 30) bmiCategory = 'Overweight';
  else bmiCategory = 'Obese';

  return { bmi, bmiCategory };
}

function parseMetric(value) {
  const parsed = parseFloat(String(value || '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
}
