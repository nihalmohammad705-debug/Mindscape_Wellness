// Mood types with colors and emojis
export const MOOD_TYPES = [
  { value: 'happy', label: '😊 Happy', color: '#48bb78', intensity: 8 },
  { value: 'relaxed', label: '😌 Relaxed', color: '#4299e1', intensity: 7 },
  { value: 'neutral', label: '😐 Neutral', color: '#a0aec0', intensity: 5 },
  { value: 'stressed', label: '😥 Stressed', color: '#ed8936', intensity: 4 },
  { value: 'sad', label: '😔 Sad', color: '#e53e3e', intensity: 3 },
  { value: 'anxious', label: '😰 Anxious', color: '#d69e2e', intensity: 3 },
  { value: 'angry', label: '😠 Angry', color: '#c53030', intensity: 2 }
];

// Meal types
export const MEAL_TYPES = [
  { value: 'breakfast', label: '🍳 Breakfast' },
  { value: 'lunch', label: '🍲 Lunch' },
  { value: 'dinner', label: '🍽️ Dinner' },
  { value: 'snacks', label: '🍎 Snacks' },
  { value: 'other', label: '🥤 Other' }
];

// Activity intensity levels
export const INTENSITY_LEVELS = [
  { value: 'light', label: '💚 Light', description: 'Easy, minimal effort' },
  { value: 'moderate', label: '💛 Moderate', description: 'Moderate effort, can talk but not sing' },
  { value: 'vigorous', label: '❤️ Vigorous', description: 'Hard effort, difficult to talk' }
];

// Chart colors
export const CHART_COLORS = {
  primary: '#667eea',
  secondary: '#764ba2',
  success: '#48bb78',
  warning: '#ed8936',
  danger: '#e53e3e',
  info: '#4299e1',
  light: '#a0aec0'
};

// Time ranges for analytics
export const TIME_RANGES = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' }
];

// Wellness tips
export const WELLNESS_TIPS = [
  {
    title: "Stay Hydrated",
    description: "Drink at least 8 glasses of water daily for better mental clarity and energy.",
    icon: "💧",
    category: "hydration"
  },
  {
    title: "Move Regularly",
    description: "Take short activity breaks every hour to reduce sedentary time.",
    icon: "🚶‍♀️",
    category: "activity"
  },
  {
    title: "Practice Mindfulness",
    description: "Spend 5-10 minutes daily on meditation or deep breathing exercises.",
    icon: "🧘",
    category: "mental"
  },
  {
    title: "Sleep Well",
    description: "Aim for 7-9 hours of quality sleep each night for optimal recovery.",
    icon: "😴",
    category: "sleep"
  },
  {
    title: "Eat Balanced Meals",
    description: "Include protein, healthy fats, and complex carbs in each meal.",
    icon: "🥗",
    category: "nutrition"
  },
  {
    title: "Digital Detox",
    description: "Take regular breaks from screens to reduce eye strain and mental fatigue.",
    icon: "📱",
    category: "mental"
  }
];

// Nutrition goals (based on average adult)
export const NUTRITION_GOALS = {
  calories: 2000,
  protein: 50, // grams
  carbs: 250, // grams
  fat: 70, // grams
  water: 2000 // ml
};

// Activity goals
export const ACTIVITY_GOALS = {
  steps: 10000,
  activeMinutes: 30,
  exerciseDays: 5
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'mindscape_token',
  USER: 'mindscape_user',
  SETTINGS: 'mindscape_settings'
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY_USER: '/auth/verify-user',
    RESET_PASSWORD: '/auth/reset-password'
  },
  USER: {
    PROFILE: '/users/profile',
    DASHBOARD: '/users/dashboard'
  },
  MOOD: {
    ENTRIES: '/mood/entries',
    ANALYTICS: '/mood/analytics'
  },
  NUTRITION: {
    FOOD_ITEMS: '/nutrition/food-items',
    ENTRIES: '/nutrition/entries',
    SUMMARY: '/nutrition/summary'
  },
  ACTIVITY: {
    ACTIVITY_TYPES: '/activity/activity-types',
    ENTRIES: '/activity/entries',
    SUMMARY: '/activity/summary'
  }
};

export default {
  MOOD_TYPES,
  MEAL_TYPES,
  INTENSITY_LEVELS,
  CHART_COLORS,
  TIME_RANGES,
  WELLNESS_TIPS,
  NUTRITION_GOALS,
  ACTIVITY_GOALS,
  STORAGE_KEYS,
  API_ENDPOINTS
};