// client/src/utils/moodQuestions.js
export const moodQuestions = [
  {
    id: 1,
    question: "How are you feeling right now?",
    type: "core_emotion",
    options: [
      { value: "joyful", label: "😄 Joyful", score: 10 },
      { value: "peaceful", label: "😌 Peaceful", score: 9 },
      { value: "content", label: "🙂 Content", score: 8 },
      { value: "neutral", label: "😐 Neutral", score: 6 },
      { value: "tired", label: "😴 Tired", score: 5 },
      { value: "anxious", label: "😟 Anxious", score: 4 },
      { value: "sad", label: "😔 Sad", score: 3 },
      { value: "angry", label: "😠 Frustrated", score: 2 },
      { value: "overwhelmed", label: "😫 Overwhelmed", score: 1 }
    ]
  },
  {
    id: 2,
    question: "How was your sleep quality last night?",
    type: "sleep",
    options: [
      { value: "excellent", label: "💤 Deep & Restful", score: 10 },
      { value: "good", label: "😴 Good Quality", score: 8 },
      { value: "fair", label: "🛌 Interrupted Sleep", score: 6 },
      { value: "poor", label: "👀 Restless Night", score: 3 }
    ]
  },
  {
    id: 3,
    question: "What's your energy level like today?",
    type: "energy",
    options: [
      { value: "energized", label: "⚡ Full of Energy", score: 10 },
      { value: "balanced", label: "🔋 Balanced", score: 8 },
      { value: "low", label: "🪫 Low Energy", score: 4 },
      { value: "drained", label: "😴 Completely Drained", score: 2 }
    ]
  },
  {
    id: 4,
    question: "How would you describe your stress level?",
    type: "stress",
    options: [
      { value: "calm", label: "😌 Completely Calm", score: 10 },
      { value: "manageable", label: "🙂 Manageable", score: 8 },
      { value: "moderate", label: "😐 Some Stress", score: 6 },
      { value: "high", label: "😟 High Stress", score: 3 },
      { value: "overwhelming", label: "😫 Overwhelming", score: 1 }
    ]
  },
  {
    id: 5,
    question: "How productive do you feel today?",
    type: "productivity",
    options: [
      { value: "very", label: "🚀 Highly Productive", score: 10 },
      { value: "moderate", label: "📝 Moderately Productive", score: 7 },
      { value: "low", label: "📉 Low Motivation", score: 4 },
      { value: "none", label: "⏰ Can't Focus", score: 2 }
    ]
  },
  {
    id: 6,
    question: "How connected do you feel to others?",
    type: "social",
    options: [
      { value: "very", label: "🤗 Very Connected", score: 10 },
      { value: "somewhat", label: "👥 Somewhat Connected", score: 7 },
      { value: "isolated", label: "🏝️ Feeling Isolated", score: 4 },
      { value: "lonely", label: "😔 Quite Lonely", score: 2 }
    ]
  },
  {
    id: 7,
    question: "How is your physical health feeling?",
    type: "physical",
    options: [
      { value: "excellent", label: "💪 Strong & Healthy", score: 10 },
      { value: "good", label: "👍 Feeling Good", score: 8 },
      { value: "okay", label: "👌 Okay", score: 6 },
      { value: "poor", label: "🤒 Not Great", score: 3 }
    ]
  },
  {
    id: 8,
    question: "How satisfied are you with your day so far?",
    type: "satisfaction",
    options: [
      { value: "very", label: "🌟 Very Satisfied", score: 10 },
      { value: "somewhat", label: "⭐ Somewhat Satisfied", score: 7 },
      { value: "neutral", label: "💫 Neutral", score: 5 },
      { value: "dissatisfied", label: "🌑 Dissatisfied", score: 3 }
    ]
  },
  {
    id: 9,
    question: "How hopeful do you feel about tomorrow?",
    type: "optimism",
    options: [
      { value: "very", label: "🌈 Very Hopeful", score: 10 },
      { value: "somewhat", label: "✨ Somewhat Hopeful", score: 7 },
      { value: "uncertain", label: "🌫️ Uncertain", score: 5 },
      { value: "pessimistic", label: "🌧️ Not Very Hopeful", score: 3 }
    ]
  },
  {
    id: 10,
    question: "How well are you coping with challenges?",
    type: "resilience",
    options: [
      { value: "excellent", label: "🛡️ Handling Well", score: 10 },
      { value: "good", label: "💪 Managing Okay", score: 7 },
      { value: "struggling", label: "🌊 Struggling", score: 4 },
      { value: "overwhelmed", label: "🌪️ Overwhelmed", score: 2 }
    ]
  }
];

export const detailedSuggestions = {
  excellent: [
    {
      title: "Maintain Your Positive Momentum! 🌟",
      content: "You're in a great space right now! Consider channeling this positive energy into creative projects, helping others, or setting new personal goals. Your current state is perfect for building healthy habits and strengthening relationships.",
      activities: [
        "Start a gratitude journal to maintain this positive mindset",
        "Share your positive energy with someone who might need it",
        "Tackle a challenging project you've been putting off"
      ]
    }
  ],
  good: [
    {
      title: "Nurture Your Balanced State 🌿",
      content: "You're in a good place with room for growth. Focus on maintaining this balance while exploring small improvements. Consider incorporating mindfulness practices and self-care routines to enhance your wellbeing further.",
      activities: [
        "Try a 10-minute meditation session",
        "Schedule some 'me time' this week",
        "Connect with a friend or loved one"
      ]
    }
  ],
  average: [
    {
      title: "Time for Gentle Self-Care 💖",
      content: "You're going through a neutral phase - perfect for reflection and gentle improvement. Be kind to yourself and focus on small, manageable steps. Remember that every day is a new opportunity for growth.",
      activities: [
        "Take a relaxing walk in nature",
        "Practice deep breathing for 5 minutes",
        "Do one small thing that brings you joy"
      ]
    }
  ],
  needs_attention: [
    {
      title: "Prioritize Your Wellbeing 🌈",
      content: "It seems you're facing some challenges. This is completely normal and temporary. Focus on basic self-care: proper rest, nutrition, and gentle movement. Remember that asking for help is a sign of strength, not weakness.",
      activities: [
        "Reach out to a trusted friend or family member",
        "Focus on getting 7-8 hours of quality sleep",
        "Try gentle yoga or stretching"
      ]
    }
  ],
  critical: [
    {
      title: "Your Wellbeing Comes First 💫",
      content: "You're going through a tough time, and that's okay. Right now, focus on the basics: rest, hydration, and simple comforts. Be extra gentle with yourself. Consider reaching out to professional support - you don't have to face this alone.",
      activities: [
        "Contact a mental health professional or helpline",
        "Focus on one small positive thing each day",
        "Practice self-compassion - you're doing your best"
      ]
    }
  ]
};

export const motivationalQuotes = [
  {
    text: "This too shall pass. Nothing in life is permanent, and every storm runs out of rain.",
    author: "Ancient Proverb"
  },
  {
    text: "You are stronger than you think, more capable than you imagine, and worth more than you know.",
    author: "Unknown"
  },
  {
    text: "The only way out is through. Keep going, one step at a time.",
    author: "Robert Frost"
  },
  {
    text: "Your current situation is not your final destination. The best is yet to come.",
    author: "Unknown"
  },
  {
    text: "Be gentle with yourself. You're doing the best you can with what you have right now.",
    author: "Unknown"
  },
  {
    text: "Every day may not be good, but there is something good in every day. Look for it.",
    author: "Alice Morse Earle"
  },
  {
    text: "Progress, not perfection. Small steps still move you forward.",
    author: "Unknown"
  },
  {
    text: "You've survived 100% of your bad days so far. You can handle this too.",
    author: "Unknown"
  }
];

export const getMoodLevel = (score) => {
  if (score >= 8.5) return "excellent";
  if (score >= 7) return "good";
  if (score >= 5.5) return "average";
  if (score >= 4) return "needs_attention";
  return "critical";
};

export const getRandomSuggestion = (moodLevel) => {
  const suggestions = detailedSuggestions[moodLevel];
  return suggestions[Math.floor(Math.random() * suggestions.length)];
};

export const getRandomQuote = () => {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
};