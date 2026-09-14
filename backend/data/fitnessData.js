export const workoutPlans = {
  "Gym Workout": {
    goal: "Gym Workout",
    description: "Full gym equipment workout split using barbells, dumbbells, cables, and strength machines for optimal hypertrophy and strength.",
    schedule: {
      Monday: {
        focus: "Chest + Triceps",
        exercises: [
          {
            name: "Barbell Bench Press",
            muscle: "Mid Chest",
            sets: 4,
            reps: "8-10",
            rest: "90 sec",
            difficulty: "Intermediate",
            instructions: "Lie flat on bench, lower bar to mid-chest with elbows at 45 degrees, explode up.",
            commonMistakes: "Bouncing bar off chest, flaring elbows out too wide.",
            alternative: "Dumbbell Bench Press"
          },
          {
            name: "Incline Dumbbell Press",
            muscle: "Upper Chest",
            sets: 3,
            reps: "10-12",
            rest: "75 sec",
            difficulty: "Intermediate",
            instructions: "Set bench to 30-45 degree incline. Press dumbbells upwards while maintaining chest tension.",
            commonMistakes: "Incline angle too steep.",
            alternative: "Incline Barbell Press"
          },
          {
            name: "Cable Chest Flyes",
            muscle: "Chest Inner",
            sets: 3,
            reps: "12-15",
            rest: "60 sec",
            difficulty: "Beginner",
            instructions: "Bring cable handles together in front of chest in a hugging motion, squeeze for 1 sec.",
            commonMistakes: "Bending arms too much.",
            alternative: "Dumbbell Flyes"
          },
          {
            name: "Tricep Rope Pushdowns",
            muscle: "Triceps",
            sets: 4,
            reps: "12-15",
            rest: "60 sec",
            difficulty: "Beginner",
            instructions: "Keep elbows pinned to torso, extend arms fully downward and spread rope at bottom.",
            commonMistakes: "Using shoulder momentum.",
            alternative: "Overhead Cable Extension"
          },
          {
            name: "Skull Crushers (EZ Bar)",
            muscle: "Triceps (Long Head)",
            sets: 3,
            reps: "10-12",
            rest: "75 sec",
            difficulty: "Intermediate",
            instructions: "Lie on bench, lower bar toward forehead by bending elbows, press back to start.",
            commonMistakes: "Flaring elbows outward.",
            alternative: "Close-grip Bench Press"
          }
        ]
      },
      Tuesday: {
        focus: "Back + Biceps",
        exercises: [
          {
            name: "Bent Over Barbell Row",
            muscle: "Lats & Mid-Back",
            sets: 4,
            reps: "8-10",
            rest: "90 sec",
            difficulty: "Intermediate",
            instructions: "Hinge at hips, pull barbell to lower ribcage, keep spine neutral and squeeze lats.",
            commonMistakes: "Rounding spine.",
            alternative: "Single-Arm Dumbbell Row"
          },
          {
            name: "Lat Pulldown",
            muscle: "Lats (Width)",
            sets: 4,
            reps: "10-12",
            rest: "75 sec",
            difficulty: "Beginner",
            instructions: "Grip wide, pull bar down to upper chest, keep chest lifted.",
            commonMistakes: "Leaning back excessively.",
            alternative: "Cable Straight Arm Pulldown"
          },
          {
            name: "Seated Cable Row",
            muscle: "Rhomboids & Mid-Back",
            sets: 3,
            reps: "12",
            rest: "60 sec",
            difficulty: "Beginner",
            instructions: "Pull handle into abdomen, drive shoulders back, hold contraction for 1 sec.",
            commonMistakes: "Shrugging shoulders up.",
            alternative: "Incline Dumbbell Row"
          },
          {
            name: "Barbell Bicep Curls",
            muscle: "Biceps",
            sets: 4,
            reps: "10-12",
            rest: "60 sec",
            difficulty: "Beginner",
            instructions: "Stand tall, curl bar upward without moving upper arms, squeeze biceps at top.",
            commonMistakes: "Swinging hips for momentum.",
            alternative: "Dumbbell Bicep Curls"
          },
          {
            name: "Hammer Curls",
            muscle: "Brachialis & Forearms",
            sets: 3,
            reps: "12-15",
            rest: "60 sec",
            difficulty: "Beginner",
            instructions: "Hold dumbbells with neutral grip (palms facing inward), curl up steadily.",
            commonMistakes: "Alternating too fast.",
            alternative: "Cable Rope Curls"
          }
        ]
      },
      Wednesday: {
        focus: "Legs + Core",
        exercises: [
          {
            name: "Barbell Back Squats",
            muscle: "Quadriceps & Glutes",
            sets: 4,
            reps: "8-10",
            rest: "120 sec",
            difficulty: "Intermediate",
            instructions: "Bar across upper back, squat down until thighs are parallel to ground, push back up.",
            commonMistakes: "Knees caving inward.",
            alternative: "Leg Press"
          },
          {
            name: "Romanian Deadlifts (RDL)",
            muscle: "Hamstrings & Glutes",
            sets: 4,
            reps: "10-12",
            rest: "90 sec",
            difficulty: "Intermediate",
            instructions: "Hinge at hips with slight knee bend, lower dumbbells along shins until hamstrings stretch.",
            commonMistakes: "Rounding lower back.",
            alternative: "Lying Leg Curls"
          },
          {
            name: "Leg Extensions",
            muscle: "Quadriceps",
            sets: 3,
            reps: "12-15",
            rest: "60 sec",
            difficulty: "Beginner",
            instructions: "Extend legs fully, flex quad at peak extension for 1 second.",
            commonMistakes: "Kicking weight up too forcefully.",
            alternative: "Goblet Squats"
          },
          {
            name: "Standing Calf Raises",
            muscle: "Calves",
            sets: 4,
            reps: "15-20",
            rest: "45 sec",
            difficulty: "Beginner",
            instructions: "Rise high onto toes, lower under control into a full heel stretch.",
            commonMistakes: "Bouncing rapidly.",
            alternative: "Seated Calf Raises"
          }
        ]
      },
      Thursday: {
        focus: "Shoulders + Triceps",
        exercises: [
          {
            name: "Overhead Dumbbell Press",
            muscle: "Deltoids",
            sets: 4,
            reps: "8-10",
            rest: "90 sec",
            difficulty: "Intermediate",
            instructions: "Sit upright, press dumbbells directly overhead until arms lock out.",
            commonMistakes: "Excessive lower back arching.",
            alternative: "Barbell Military Press"
          },
          {
            name: "Dumbbell Lateral Raises",
            muscle: "Side Delts",
            sets: 4,
            reps: "12-15",
            rest: "60 sec",
            difficulty: "Beginner",
            instructions: "Raise arms out to sides with slight bend in elbows until parallel to shoulder height.",
            commonMistakes: "Using heavy weight and swinging.",
            alternative: "Cable Lateral Raise"
          },
          {
            name: "Face Pulls",
            muscle: "Rear Delts & Posture",
            sets: 4,
            reps: "15",
            rest: "60 sec",
            difficulty: "Beginner",
            instructions: "Attach rope to cable at eye height, pull towards face while pulling hands apart.",
            commonMistakes: "Pulling too low.",
            alternative: "Reverse Pec Deck Fly"
          }
        ]
      },
      Friday: {
        focus: "Back + Biceps + Core",
        exercises: [
          {
            name: "Lat Pulldown / Cable Rows",
            muscle: "Lats & Rhomboids",
            sets: 4,
            reps: "10-12",
            rest: "75 sec",
            difficulty: "Intermediate",
            instructions: "Pull weight to torso with squeeze between shoulder blades.",
            commonMistakes: "Half reps.",
            alternative: "Single-Arm Cable Row"
          },
          {
            name: "Preacher Bicep Curl",
            muscle: "Biceps",
            sets: 3,
            reps: "12",
            rest: "60 sec",
            difficulty: "Beginner",
            instructions: "Rest upper arms on preacher bench pad, curl EZ bar upward.",
            commonMistakes: "Lifting elbows off pad.",
            alternative: "Incline Dumbbell Curl"
          },
          {
            name: "Cable Ab Crunches",
            muscle: "Abs",
            sets: 3,
            reps: "15",
            rest: "45 sec",
            difficulty: "Beginner",
            instructions: "Kneel beneath cable pulley, crunch torso downward using abdominal contraction.",
            commonMistakes: "Pulling with arms instead of abs.",
            alternative: "Hanging Leg Raises"
          }
        ]
      },
      Saturday: {
        focus: "Full Body Gym Conditioning",
        exercises: [
          {
            name: "Dumbbell Thrusters",
            muscle: "Quads & Shoulders",
            sets: 4,
            reps: "12",
            rest: "75 sec",
            difficulty: "Intermediate",
            instructions: "Full squat with dumbbells at shoulder rack, press overhead seamlessly on rising.",
            commonMistakes: "Pausing between squat and press.",
            alternative: "Leg Press + Shoulder Press"
          },
          {
            name: "Farmer's Walk",
            muscle: "Grip & Traps & Core",
            sets: 4,
            reps: "45 sec walk",
            rest: "60 sec",
            difficulty: "Beginner",
            instructions: "Pick up heavy dumbbells, stand tall, walk with controlled posture.",
            commonMistakes: "Slouching shoulders.",
            alternative: "Trap Bar Carry"
          }
        ]
      },
      Sunday: {
        focus: "Rest & Active Recovery",
        isRest: true,
        exercises: [
          {
            name: "Foam Rolling & Mobility",
            muscle: "Recovery",
            sets: 1,
            reps: "20 mins",
            rest: "N/A",
            difficulty: "Beginner",
            instructions: "Light cardio, foam rolling, hydration.",
            commonMistakes: "Heavy lifting.",
            alternative: "Light Walk"
          }
        ]
      }
    }
  },

  "Home Workout": {
    goal: "Home Workout",
    description: "100% Equipment-Free Bodyweight Routine. Designed strictly without any dumbbells, barbells, or gym machines.",
    schedule: {
      Monday: {
        focus: "Chest + Triceps (Bodyweight)",
        exercises: [
          {
            name: "Standard Push-Ups",
            muscle: "Chest & Core",
            sets: 4,
            reps: "12-15",
            rest: "60 sec",
            difficulty: "Beginner",
            instructions: "Maintain rigid plank posture, lower chest until elbows bend to 90 degrees, push back up.",
            commonMistakes: "Sagging hips or flaring elbows out 90°.",
            alternative: "Knee Push-Ups (Easier) or Incline Push-Ups"
          },
          {
            name: "Decline Push-Ups (Feet on Bed / Chair)",
            muscle: "Upper Chest",
            sets: 3,
            reps: "10-12",
            rest: "60 sec",
            difficulty: "Intermediate",
            instructions: "Place feet elevated on chair or bed, hands on floor, perform push-up focusing on upper chest.",
            commonMistakes: "Arching lower back.",
            alternative: "Pike Push-Ups"
          },
          {
            name: "Chair / Bench Dips",
            muscle: "Triceps",
            sets: 4,
            reps: "12-15",
            rest: "45 sec",
            difficulty: "Beginner",
            instructions: "Grip front edge of sturdy chair, lower hips until upper arms are parallel to floor, push up.",
            commonMistakes: "Shrugging shoulders.",
            alternative: "Diamond Push-Ups"
          },
          {
            name: "Diamond Push-Ups",
            muscle: "Triceps & Inner Chest",
            sets: 3,
            reps: "8-12",
            rest: "60 sec",
            difficulty: "Intermediate",
            instructions: "Form diamond shape with thumbs and index fingers beneath chest, lower and press.",
            commonMistakes: "Flaring elbows excessively.",
            alternative: "Close-grip Push-Ups"
          }
        ]
      },
      Tuesday: {
        focus: "Back + Biceps (Bodyweight)",
        exercises: [
          {
            name: "Doorframe Bodyweight Rows",
            muscle: "Lats & Upper Back",
            sets: 4,
            reps: "15",
            rest: "60 sec",
            difficulty: "Beginner",
            instructions: "Stand close to doorframe, grip sides, lean back and pull chest to doorframe.",
            commonMistakes: "Swinging body.",
            alternative: "Towel Resistance Rows"
          },
          {
            name: "Under-Table Inverted Rows",
            muscle: "Mid-Back & Rhomboids",
            sets: 4,
            reps: "10-12",
            rest: "60 sec",
            difficulty: "Intermediate",
            instructions: "Lie beneath sturdy table, grip table edge overhand, pull chest up toward table bottom.",
            commonMistakes: "Bending at waist instead of straight body line.",
            alternative: "Doorframe Rows"
          },
          {
            name: "Doorframe Bicep Pull-Isometric Hold",
            muscle: "Biceps",
            sets: 4,
            reps: "12 reps (2s hold)",
            rest: "45 sec",
            difficulty: "Beginner",
            instructions: "Grip doorframe with palms facing inward, pull body forward squeezing biceps.",
            commonMistakes: "Using leg momentum.",
            alternative: "Towel Bicep Pulls"
          },
          {
            name: "Superman Back Extensions",
            muscle: "Lower Back & Erectors",
            sets: 3,
            reps: "15 (2s hold at peak)",
            rest: "45 sec",
            difficulty: "Beginner",
            instructions: "Lie stomach down on floor, lift arms and legs simultaneously 2 inches off floor.",
            commonMistakes: "Hyper-extending neck.",
            alternative: "Bird-Dog Exercise"
          }
        ]
      },
      Wednesday: {
        focus: "Legs + Glutes (Bodyweight)",
        exercises: [
          {
            name: "Bodyweight Air Squats",
            muscle: "Quadriceps & Glutes",
            sets: 4,
            reps: "20",
            rest: "45 sec",
            difficulty: "Beginner",
            instructions: "Stand shoulder-width, sit hips back as if sitting in a chair, squat deep and rise.",
            commonMistakes: "Heels lifting off floor.",
            alternative: "Chair Squats"
          },
          {
            name: "Bulgarian Split Squats (Using Chair)",
            muscle: "Quads & Glutes",
            sets: 3,
            reps: "12 each leg",
            rest: "60 sec",
            difficulty: "Intermediate",
            instructions: "Place one foot back on chair seat, lower front knee to 90 degrees, press up.",
            commonMistakes: "Leaning torso too far forward.",
            alternative: "Bodyweight Forward Lunges"
          },
          {
            name: "Glute Bridges",
            muscle: "Glutes & Hamstrings",
            sets: 4,
            reps: "15-20",
            rest: "45 sec",
            difficulty: "Beginner",
            instructions: "Lie flat on back, feet flat on floor, lift hips toward ceiling squeezing glutes for 1 sec.",
            commonMistakes: "Arching lower back.",
            alternative: "Single-Leg Glute Bridge"
          },
          {
            name: "Bodyweight Calf Raises",
            muscle: "Calves",
            sets: 4,
            reps: "20-25",
            rest: "30 sec",
            difficulty: "Beginner",
            instructions: "Stand near wall for balance, push high onto toes, lower heels slowly.",
            commonMistakes: "Bouncing fast.",
            alternative: "Single-Leg Calf Raises"
          }
        ]
      },
      Thursday: {
        focus: "Shoulders + Abs (Bodyweight)",
        exercises: [
          {
            name: "Pike Push-Ups",
            muscle: "Deltoids & Shoulders",
            sets: 4,
            reps: "10-12",
            rest: "60 sec",
            difficulty: "Intermediate",
            instructions: "Form inverted V-shape with hips high, bend elbows lowering top of head to floor.",
            commonMistakes: "Flaring elbows out sideways.",
            alternative: "Decline Push-Ups"
          },
          {
            name: "Wall Plank Hold / Walk",
            muscle: "Shoulders & Core",
            sets: 3,
            reps: "30-45 sec hold",
            rest: "60 sec",
            difficulty: "Intermediate",
            instructions: "Walk feet up wall into 45-degree handstand plank, brace shoulders.",
            commonMistakes: "Sagging hips.",
            alternative: "High Plank Arm Taps"
          },
          {
            name: "Water Bottle Lateral Raises",
            muscle: "Side Delts",
            sets: 4,
            reps: "15-20",
            rest: "45 sec",
            difficulty: "Beginner",
            instructions: "Raise arms sideways holding filled 1L water bottles.",
            commonMistakes: "Swinging torso.",
            alternative: "Arm Circles Hold"
          }
        ]
      },
      Friday: {
        focus: "Full Body Calisthenics",
        exercises: [
          {
            name: "Bodyweight Jump Squats",
            muscle: "Quads & Explosive Power",
            sets: 4,
            reps: "15",
            rest: "60 sec",
            difficulty: "Intermediate",
            instructions: "Squat deep and explode upward off floor, land softly into next squat.",
            commonMistakes: "Hard landing on heels.",
            alternative: "Speed Air Squats"
          },
          {
            name: "Push-Up to Side Plank Rotation",
            muscle: "Chest & Obliques",
            sets: 3,
            reps: "10 total",
            rest: "60 sec",
            difficulty: "Intermediate",
            instructions: "Perform push-up, rotate into side plank raising top hand, repeat on other side.",
            commonMistakes: "Rushing movement.",
            alternative: "Standard Push-Ups + Side Plank"
          }
        ]
      },
      Saturday: {
        focus: "HIIT Cardio & Abs Burner",
        exercises: [
          {
            name: "Burpees (No Equipment)",
            muscle: "Full Body Cardio",
            sets: 4,
            reps: "10-12",
            rest: "60 sec",
            difficulty: "Intermediate",
            instructions: "Squat, jump feet back to plank, pushup, jump feet forward, jump up.",
            commonMistakes: "Skipping push-up.",
            alternative: "Squat Thrusts"
          },
          {
            name: "Mountain Climbers",
            muscle: "Core & Cardio",
            sets: 4,
            reps: "45 sec work",
            rest: "20 sec",
            difficulty: "Beginner",
            instructions: "High plank position, drive knees to chest rapidly in running motion.",
            commonMistakes: "Hips bouncing high.",
            alternative: "High Knees"
          },
          {
            name: "Bicycle Crunches",
            muscle: "Abs & Obliques",
            sets: 4,
            reps: "20 total",
            rest: "30 sec",
            difficulty: "Beginner",
            instructions: "Alternate opposite elbow to knee with 1 sec squeeze.",
            commonMistakes: "Pulling neck.",
            alternative: "Lying Leg Lifts"
          }
        ]
      },
      Sunday: {
        focus: "Rest & Full Body Mobility",
        isRest: true,
        exercises: [
          {
            name: "Gentle Stretching & Hydration",
            muscle: "Recovery",
            sets: 1,
            reps: "20 mins",
            rest: "N/A",
            difficulty: "Beginner",
            instructions: "Cat-cow stretches, child's pose, hamstring stretch.",
            commonMistakes: "Over-stretching painfully.",
            alternative: "Light 20-min Walk"
          }
        ]
      }
    }
  }
};

export const exerciseLibrary = [
  // CHEST
  { id: "ex-1", name: "Barbell Bench Press", category: "Chest", muscle: "Mid Chest", equipment: "Barbell & Bench", difficulty: "Intermediate", setsReps: "4 sets x 8-10 reps", bodyweightAlt: "Push-ups", instructions: "Lie flat on bench, lower bar to mid chest, press up vertically.", commonMistakes: "Bouncing bar off chest." },
  { id: "ex-2", name: "Incline Dumbbell Press", category: "Chest", muscle: "Upper Chest", equipment: "Dumbbells & Incline Bench", difficulty: "Intermediate", setsReps: "3 sets x 10-12 reps", bodyweightAlt: "Decline Push-ups (Feet on chair)", instructions: "Set bench to 30 deg incline, press dumbbells up together.", commonMistakes: "Bench too steep." },
  { id: "ex-3", name: "Standard Push-up", category: "Chest", muscle: "Chest & Core", equipment: "Bodyweight", difficulty: "Beginner", setsReps: "3 sets x 15-20 reps", bodyweightAlt: "Knee Push-ups", instructions: "Keep body straight in plank position, bend arms to 90 degrees.", commonMistakes: "Sagging hips." },
  { id: "ex-4", name: "Cable Chest Flyes", category: "Chest", muscle: "Chest Inner", equipment: "Cable Machine", difficulty: "Beginner", setsReps: "3 sets x 12-15 reps", bodyweightAlt: "Dumbbell Flyes", instructions: "Bring cables together in front of chest like hugging a tree.", commonMistakes: "Bending elbows too much." },

  // BACK
  { id: "ex-5", name: "Barbell Deadlift", category: "Back", muscle: "Entire Posterior Chain", equipment: "Barbell", difficulty: "Advanced", setsReps: "4 sets x 5 reps", bodyweightAlt: "Single Leg Bodyweight Deadlift", instructions: "Hinge at hips, grip bar shoulder width, drive through heels to lock out hips.", commonMistakes: "Rounding back." },
  { id: "ex-6", name: "Lat Pulldown", category: "Back", muscle: "Lats (Width)", equipment: "Cable Machine", difficulty: "Beginner", setsReps: "4 sets x 10-12 reps", bodyweightAlt: "Doorframe Rows / Pull-ups", instructions: "Pull bar down to upper chest while arching upper back slightly.", commonMistakes: "Pulling behind neck." },
  { id: "ex-7", name: "Pull-ups", category: "Back", muscle: "Lats & Upper Back", equipment: "Bodyweight / Pull-up Bar", difficulty: "Intermediate", setsReps: "3 sets x max reps", bodyweightAlt: "Under-Table Rows", instructions: "Overhand grip, pull chin above bar.", commonMistakes: "Swinging legs for momentum." },

  // SHOULDERS
  { id: "ex-8", name: "Overhead Dumbbell Press", category: "Shoulders", muscle: "Front & Side Delts", equipment: "Dumbbells", difficulty: "Intermediate", setsReps: "4 sets x 8-10 reps", bodyweightAlt: "Pike Push-ups", instructions: "Press dumbbells directly overhead from shoulder height.", commonMistakes: "Arching lower back." },
  { id: "ex-9", name: "Pike Push-ups", category: "Shoulders", muscle: "Delts & Upper Body", equipment: "Bodyweight", difficulty: "Intermediate", setsReps: "4 sets x 10-12 reps", bodyweightAlt: "Pike Push-ups", instructions: "Hips high in inverted V, lower top of head to floor.", commonMistakes: "Flaring elbows." },

  // BICEPS & TRICEPS
  { id: "ex-10", name: "Barbell Bicep Curl", category: "Biceps", muscle: "Biceps Short & Long Head", equipment: "Barbell", difficulty: "Beginner", setsReps: "4 sets x 10-12 reps", bodyweightAlt: "Doorframe Isometric Curls", instructions: "Curl bar upward keeping upper arms static.", commonMistakes: "Swinging hips." },
  { id: "ex-11", name: "Tricep Chair Dips", category: "Triceps", muscle: "Triceps", equipment: "Bodyweight / Chair", difficulty: "Beginner", setsReps: "3 sets x 15 reps", bodyweightAlt: "Tricep Chair Dips", instructions: "Lower hips close to chair edge until elbows at 90 deg.", commonMistakes: "Shrugging shoulders." },

  // LEGS & GLUTES
  { id: "ex-12", name: "Barbell Back Squat", category: "Legs", muscle: "Quads & Glutes", equipment: "Barbell & Rack", difficulty: "Intermediate", setsReps: "4 sets x 8-10 reps", bodyweightAlt: "Bodyweight Air Squats", instructions: "Squat down until hips drop below knee level.", commonMistakes: "Knees collapsing inward." },
  { id: "ex-13", name: "Bodyweight Air Squat", category: "Legs", muscle: "Quads & Glutes", equipment: "Bodyweight", difficulty: "Beginner", setsReps: "4 sets x 20 reps", bodyweightAlt: "Bodyweight Air Squats", instructions: "Squat deep sitting back into heels, push back up.", commonMistakes: "Heels lifting." },
  { id: "ex-14", name: "Glute Bridges", category: "Glutes", muscle: "Gluteus Maximus", equipment: "Bodyweight", difficulty: "Beginner", setsReps: "4 sets x 15-20 reps", bodyweightAlt: "Single-Leg Glute Bridge", instructions: "Drive through heels to lift hips high, squeeze glutes at top.", commonMistakes: "Arching lower back." },

  // CORE & CARDIO
  { id: "ex-15", name: "Forearm Plank", category: "Core", muscle: "Transverse Abdominis", equipment: "Bodyweight", difficulty: "Beginner", setsReps: "3 sets x 60 sec hold", bodyweightAlt: "Knee Plank", instructions: "Hold elbows directly beneath shoulders, body rigid.", commonMistakes: "Sagging lower back." },
  { id: "ex-16", name: "Burpees", category: "Cardio", muscle: "Full Body Conditioning", equipment: "Bodyweight", difficulty: "Intermediate", setsReps: "4 sets x 12 reps", bodyweightAlt: "Squat Thrusts", instructions: "Squat, kick feet out to pushup, jump up with hands overhead.", commonMistakes: "Landing heavily on feet." }
];

export const dietPlans = {
  Vegetarian: {
    preference: "Vegetarian",
    philosophy: "🌱 100% Whole Food & Natural Vegetarian Nutrition. Zero Artificial Supplements Needed.",
    calories: "2,000 - 2,400 kcal (Adjust based on goal)",
    proteinTarget: "120g - 140g (From Natural Foods)",
    meals: {
      breakfast: {
        title: "Sprouted Moong & Paneer Protein Bowl",
        calories: "~420 kcal",
        protein: "26g natural protein",
        options: "1 cup sprouted moong bean salad with tomatoes, cucumber & lemon + 100g fresh low-fat paneer cubes + 1 cup warm toned milk with almonds & chia seeds."
      },
      midMorning: {
        title: "Roasted Chana (Gram) & Greek Yogurt",
        calories: "~220 kcal",
        protein: "16g natural protein",
        options: "1/2 cup dry roasted chickpeas (bhuna chana) + 150g plain homemade curd or Greek yogurt + 5 walnuts."
      },
      lunch: {
        title: "High-Protein Rajma / Chana Dal Bowl",
        calories: "~580 kcal",
        protein: "34g natural protein",
        options: "1.5 cups cooked kidney beans (rajma) or black chana dal, 1 cup cooked brown rice or 2 multigrain chapattis + 50g pan-seared tofu/paneer + fresh green salad."
      },
      preWorkout: {
        title: "Banana with Natural Peanut Butter Toast",
        calories: "~250 kcal",
        protein: "9g natural protein",
        options: "1 ripe banana, 1.5 tbsp 100% natural peanut butter on 1 slice whole wheat bread + black coffee or green tea."
      },
      postWorkout: {
        title: "Soya Chunks & Milk Shake (No Powder)",
        calories: "~310 kcal",
        protein: "35g natural protein",
        options: "50g boiled soya chunks tossed with mild spices + 300ml cold almond or cows milk blended with 2 dates and flaxseed."
      },
      dinner: {
        title: "Paneer / Tofu Stir-Fry with Dal & Quinoa",
        calories: "~480 kcal",
        protein: "36g natural protein",
        options: "120g sauteed paneer or tofu with broccoli & bell peppers, 1 cup moong dal, 1 cup cooked quinoa or 2 phulkas."
      }
    },
    keySources: {
      protein: ["Fresh Paneer & Low-fat Cottage Cheese", "Non-GMO Tofu & Soya Chunks", "Sprouted Moong & Kala Chana", "Homemade Curd & Greek Yogurt", "Lentils (Moong, Masoor, Rajma)", "Roasted Chana & Peanuts"],
      carbs: ["Rolled Oats", "Brown Rice & Quinoa", "Sweet Potatoes", "Multigrain Rotis"],
      fats: ["Almonds & Walnuts", "Chia & Flax Seeds", "Natural Peanut Butter", "Pure Ghee (in moderation)"]
    }
  },

  "Non-Vegetarian": {
    preference: "Non-Vegetarian",
    philosophy: "Whole Food Natural Nutrition (Eggs, Fish, Chicken & Dairy)",
    calories: "2,200 - 2,600 kcal",
    proteinTarget: "140g - 170g",
    meals: {
      breakfast: {
        title: "Egg White Omelette with Multigrain Toast",
        calories: "~440 kcal",
        protein: "30g protein",
        options: "4 egg whites + 1 whole egg scrambled with spinach, 2 slices whole grain toast, green tea."
      },
      midMorning: {
        title: "Greek Yogurt & Walnuts",
        calories: "~200 kcal",
        protein: "18g protein",
        options: "150g plain Greek yogurt, 1/2 cup berries, 4 walnuts."
      },
      lunch: {
        title: "Grilled Chicken Breast & Brown Rice",
        calories: "~550 kcal",
        protein: "42g protein",
        options: "180g chicken breast, 1 cup brown rice, steam broccoli."
      },
      preWorkout: {
        title: "Fruit & Peanut Butter Toast",
        calories: "~230 kcal",
        protein: "8g protein",
        options: "1 apple, 1.5 tbsp natural peanut butter on 1 toast."
      },
      postWorkout: {
        title: "Boiled Eggs & Banana Bowl",
        calories: "~300 kcal",
        protein: "28g protein",
        options: "4 boiled egg whites + 1 whole egg + 1 banana."
      },
      dinner: {
        title: "Baked Fish / Chicken with Sweet Potato",
        calories: "~490 kcal",
        protein: "36g protein",
        options: "160g baked fish, 150g sweet potato wedges, asparagus."
      }
    },
    keySources: {
      protein: ["Chicken Breast", "Eggs & Egg Whites", "Fish (Salmon, Tilapia)", "Greek Yogurt"],
      carbs: ["Sweet Potatoes", "Brown Rice", "Oats", "Quinoa"],
      fats: ["Avocado", "Nuts & Seeds", "Olive Oil"]
    }
  },

  Vegan: {
    preference: "Vegan",
    philosophy: "🌱 100% Plant-Based Whole Foods (Zero Supplements)",
    calories: "2,000 - 2,300 kcal",
    proteinTarget: "115g - 135g",
    meals: {
      breakfast: {
        title: "Oatmeal with Hemp Seeds & Peanut Butter",
        calories: "~410 kcal",
        protein: "22g plant protein",
        options: "1 cup rolled oats cooked in soy milk, 2 tbsp hemp seeds, 1 tbsp peanut butter, berries."
      },
      midMorning: {
        title: "Roasted Chickpeas & Almonds",
        calories: "~220 kcal",
        protein: "12g plant protein",
        options: "1 cup spiced oven-roasted chickpeas + 10 almonds."
      },
      lunch: {
        title: "Tofu Stir-fry with Edamame & Quinoa",
        calories: "~530 kcal",
        protein: "32g plant protein",
        options: "180g firm tofu, 1/2 cup edamame stir-fried over 1 cup quinoa."
      },
      preWorkout: {
        title: "Banana & Almond Butter Toast",
        calories: "~240 kcal",
        protein: "7g plant protein",
        options: "1 slice sourdough toast, 1 tbsp almond butter, banana."
      },
      postWorkout: {
        title: "Soya Milk & Date Smoothie with Pumpkin Seeds",
        calories: "~280 kcal",
        protein: "25g plant protein",
        options: "300ml high-protein soy milk, 2 dates, 2 tbsp pumpkin seeds, blended."
      },
      dinner: {
        title: "Lentil Dahl (Dal) with Brown Rice",
        calories: "~460 kcal",
        protein: "28g plant protein",
        options: "1.5 cups red lentil dahl, 1 cup cooked brown rice, spinach."
      }
    },
    keySources: {
      protein: ["Firm Tofu & Tempeh", "Edamame & Soya", "Lentils (Moong, Masoor, Chana)", "Hemp & Pumpkin Seeds"],
      carbs: ["Quinoa", "Oats", "Chickpeas", "Sweet Potatoes"],
      fats: ["Almond Butter", "Avocado", "Flaxseeds"]
    }
  },

  Eggetarian: {
    preference: "Eggetarian",
    philosophy: "🌱 Whole Food Eggs & Dairy Vegetarian Diet (Zero Powder Supplements)",
    calories: "2,100 - 2,400 kcal",
    proteinTarget: "130g - 150g",
    meals: {
      breakfast: {
        title: "Egg & Paneer Scramble Toast",
        calories: "~450 kcal",
        protein: "28g natural protein",
        options: "3 egg whites + 1 whole egg + 50g paneer scrambled, 2 slices multigrain toast."
      },
      midMorning: {
        title: "Hard Boiled Eggs & Fruit",
        calories: "~190 kcal",
        protein: "14g natural protein",
        options: "3 boiled egg whites + 1 apple."
      },
      lunch: {
        title: "Egg Curry with Chapatti & Rice",
        calories: "~540 kcal",
        protein: "30g natural protein",
        options: "3 boiled eggs in tomato gravy, 2 chapattis or brown rice + salad."
      },
      preWorkout: {
        title: "Oatmeal with Peanut Butter",
        calories: "~250 kcal",
        protein: "9g natural protein",
        options: "1/2 cup oats cooked in water with 1 tbsp peanut butter."
      },
      postWorkout: {
        title: "Whole Milk & Boiled Egg Whites",
        calories: "~270 kcal",
        protein: "26g natural protein",
        options: "4 boiled egg whites + 250ml glass of fresh whole milk."
      },
      dinner: {
        title: "Paneer & Egg Bhurji with Roti",
        calories: "~480 kcal",
        protein: "34g natural protein",
        options: "100g paneer + 2 egg whites bhurji, 2 whole wheat rotis + salad."
      }
    },
    keySources: {
      protein: ["Eggs & Egg Whites", "Paneer & Cottage Cheese", "Greek Yogurt", "Milk & Curd"],
      carbs: ["Brown Rice", "Whole Wheat Roti", "Oats", "Sweet Potato"],
      fats: ["Egg Yolks", "Nuts & Seeds", "Peanut Butter"]
    }
  }
};
