import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/common/Navigation';
import './Analytics.css';

const Analytics = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('week');
  const [nutritionData, setNutritionData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('overview');

  // Load real user data from localStorage
  useEffect(() => {
    loadUserData();
  }, [user, timeRange]);

  const loadUserData = () => {
    try {
      // Load nutrition data
      const savedNutrition = localStorage.getItem(`nutritionEntries_${user?.id}`);
      if (savedNutrition) {
        const nutritionEntries = JSON.parse(savedNutrition);
        setNutritionData(nutritionEntries);
      } else {
        setNutritionData([]);
      }

      // Load activity data
      const savedActivity = localStorage.getItem(`activityEntries_${user?.id}`);
      if (savedActivity) {
        const activityEntries = JSON.parse(savedActivity);
        setActivityData(activityEntries);
      } else {
        setActivityData([]);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setNutritionData([]);
      setActivityData([]);
    }
  };

  // Calculate date ranges with correct month and quarter lengths
  const getDateRange = () => {
    const today = new Date();
    const startDate = new Date();
    
    if (timeRange === 'week') {
      // Get Monday of current week
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1);
      startDate.setDate(diff);
    } else if (timeRange === 'month') {
      // First day of current month
      startDate.setDate(1);
    } else {
      // First day of current quarter
      const quarter = Math.floor(today.getMonth() / 3);
      startDate.setMonth(quarter * 3);
      startDate.setDate(1);
    }
    
    return { 
      start: startDate.toISOString().split('T')[0], 
      end: today.toISOString().split('T')[0] 
    };
  };

  const getDaysInRange = () => {
    const { start, end } = getDateRange();
    const days = [];
    const current = new Date(start);
    const endDate = new Date(end);
    
    while (current <= endDate) {
      days.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  // Calculate comprehensive progress metrics
  const calculateMetrics = () => {
    const daysInRange = getDaysInRange();
    
    // Filter data for current time range
    const rangeNutrition = nutritionData.filter(entry => {
      const entryDate = new Date(entry.date);
      const startDate = new Date(getDateRange().start);
      const endDate = new Date(getDateRange().end);
      return entryDate >= startDate && entryDate <= endDate;
    });

    const rangeActivity = activityData.filter(entry => {
      const entryDate = new Date(entry.date);
      const startDate = new Date(getDateRange().start);
      const endDate = new Date(getDateRange().end);
      return entryDate >= startDate && entryDate <= endDate;
    });

    // Basic counts
    const totalMeals = rangeNutrition.length;
    const totalActivities = rangeActivity.length;
    
    // Get unique active days
    const nutritionDates = rangeNutrition.map(entry => entry.date);
    const activityDates = rangeActivity.map(entry => entry.date);
    const allDates = [...new Set([...nutritionDates, ...activityDates])];
    const activeDays = allDates.length;

    // Calculate correct total days for each time range
    let totalDaysDisplay;
    if (timeRange === 'week') {
      totalDaysDisplay = 7; // Always 7 days in a week
    } else if (timeRange === 'month') {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();
      totalDaysDisplay = new Date(year, month + 1, 0).getDate(); // Last day of month
    } else {
      // Quarterly - 3 months
      const today = new Date();
      const quarter = Math.floor(today.getMonth() / 3);
      const quarterStartMonth = quarter * 3;
      let totalQuarterDays = 0;
      
      for (let i = 0; i < 3; i++) {
        const month = quarterStartMonth + i;
        const year = today.getFullYear();
        totalQuarterDays += new Date(year, month + 1, 0).getDate();
      }
      totalDaysDisplay = totalQuarterDays;
    }

    // Nutrition metrics
    const totalCalories = rangeNutrition.reduce((sum, entry) => sum + (parseInt(entry.calories) || 0), 0);
    const avgDailyCalories = activeDays > 0 ? Math.round(totalCalories / activeDays) : 0;
    
    const totalProtein = rangeNutrition.reduce((sum, entry) => sum + (parseFloat(entry.protein) || 0), 0);
    const totalCarbs = rangeNutrition.reduce((sum, entry) => sum + (parseFloat(entry.carbs) || 0), 0);
    const totalFat = rangeNutrition.reduce((sum, entry) => sum + (parseFloat(entry.fat) || 0), 0);

    // Activity metrics
    const totalCaloriesBurned = rangeActivity.reduce((sum, entry) => sum + (parseInt(entry.caloriesBurned) || 0), 0);
    const totalActivityMinutes = rangeActivity.reduce((sum, entry) => sum + (parseInt(entry.duration) || 0), 0);
    const avgDailyActivity = activeDays > 0 ? Math.round(totalActivityMinutes / activeDays) : 0;

    // Calculate average calories per meal
    const avgCaloriesPerMeal = totalMeals > 0 ? Math.round(totalCalories / totalMeals) : 0;

    // Calculate average calories burned per activity
    const avgCaloriesPerActivity = totalActivities > 0 ? Math.round(totalCaloriesBurned / totalActivities) : 0;

    // Goals and progress
    const calorieGoal = 2000;
    const activityGoal = 30;
    const mealsGoal = 3;

    const calorieProgress = avgDailyCalories > 0 ? Math.min((avgDailyCalories / calorieGoal) * 100, 100) : 0;
    const activityProgress = avgDailyActivity > 0 ? Math.min((avgDailyActivity / activityGoal) * 100, 100) : 0;
    const mealsProgress = activeDays > 0 ? Math.min((totalMeals / (mealsGoal * activeDays)) * 100, 100) : 0;

    return {
      // Basic metrics
      totalMeals,
      totalActivities,
      activeDays,
      totalDays: totalDaysDisplay,
      
      // Nutrition
      totalCalories,
      avgDailyCalories,
      totalProtein: Math.round(totalProtein * 10) / 10,
      totalCarbs: Math.round(totalCarbs * 10) / 10,
      totalFat: Math.round(totalFat * 10) / 10,
      avgCaloriesPerMeal,
      
      // Activity
      totalCaloriesBurned,
      totalActivityMinutes,
      avgDailyActivity,
      avgCaloriesPerActivity,
      
      // Progress
      calorieProgress: Math.round(calorieProgress),
      activityProgress: Math.round(activityProgress),
      mealsProgress: Math.round(mealsProgress),
      consistencyScore: Math.round((activeDays / totalDaysDisplay) * 100),
      
      // Streaks
      currentStreak: calculateCurrentStreak([...rangeNutrition, ...rangeActivity]),
      bestStreak: calculateBestStreak([...rangeNutrition, ...rangeActivity])
    };
  };

  const calculateCurrentStreak = (entries) => {
    if (entries.length === 0) return 0;
    
    const dates = [...new Set(entries.map(entry => entry.date))].sort().reverse();
    let streak = 0;
    let currentDate = new Date();
    
    for (let i = 0; i < dates.length; i++) {
      const entryDate = new Date(dates[i]);
      const diffTime = currentDate - entryDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === i) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const calculateBestStreak = (entries) => {
    if (entries.length === 0) return 0;
    
    const dates = [...new Set(entries.map(entry => entry.date))].sort();
    let bestStreak = 1;
    let currentStreak = 1;
    
    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1]);
      const currDate = new Date(dates[i]);
      const diffTime = currDate - prevDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    
    return Math.max(bestStreak, currentStreak);
  };

  const getMealTypeInsights = () => {
    const distribution = { breakfast: 0, lunch: 0, dinner: 0, snacks: 0, other: 0 };
    const caloriesByMeal = { breakfast: 0, lunch: 0, dinner: 0, snacks: 0, other: 0 };

    // Filter nutrition for current time range
    const rangeNutrition = nutritionData.filter(entry => {
      const entryDate = new Date(entry.date);
      const startDate = new Date(getDateRange().start);
      const endDate = new Date(getDateRange().end);
      return entryDate >= startDate && entryDate <= endDate;
    });

    rangeNutrition.forEach(entry => {
      if (distribution.hasOwnProperty(entry.mealType)) {
        distribution[entry.mealType]++;
        caloriesByMeal[entry.mealType] += parseInt(entry.calories) || 0;
      }
    });

    const totalMeals = rangeNutrition.length;

    return Object.entries(distribution)
      .filter(([_, count]) => count > 0)
      .map(([type, count]) => ({
        type: type.charAt(0).toUpperCase() + type.slice(1),
        count,
        calories: Math.round(caloriesByMeal[type]),
        percentage: totalMeals > 0 ? Math.round((count / totalMeals) * 100) : 0,
        avgCalories: count > 0 ? Math.round(caloriesByMeal[type] / count) : 0
      }))
      .sort((a, b) => b.count - a.count);
  };

  const getActivityInsights = () => {
    const distribution = {};
    const durationByActivity = {};
    const caloriesByActivity = {};

    // Filter activities for current time range
    const rangeActivity = activityData.filter(entry => {
      const entryDate = new Date(entry.date);
      const startDate = new Date(getDateRange().start);
      const endDate = new Date(getDateRange().end);
      return entryDate >= startDate && entryDate <= endDate;
    });

    rangeActivity.forEach(entry => {
      const activityName = entry.activityName || 'Other';
      distribution[activityName] = (distribution[activityName] || 0) + 1;
      durationByActivity[activityName] = (durationByActivity[activityName] || 0) + (parseInt(entry.duration) || 0);
      caloriesByActivity[activityName] = (caloriesByActivity[activityName] || 0) + (parseInt(entry.caloriesBurned) || 0);
    });

    const totalActivities = rangeActivity.length;

    return Object.entries(distribution)
      .map(([type, count]) => ({
        type,
        count,
        totalDuration: durationByActivity[type],
        totalCalories: caloriesByActivity[type],
        percentage: totalActivities > 0 ? Math.round((count / totalActivities) * 100) : 0,
        avgDuration: count > 0 ? Math.round(durationByActivity[type] / count) : 0,
        avgCalories: count > 0 ? Math.round(caloriesByActivity[type] / count) : 0
      }))
      .sort((a, b) => b.count - a.count);
  };

  const getWeeklyTrends = () => {
    // Get Monday to Sunday of current week
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today);
    monday.setDate(diff);
    
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return {
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDay: date.toLocaleDateString('en-US', { weekday: 'long' })
      };
    });

    return last7Days.map(day => {
      const dayNutrition = nutritionData.filter(entry => entry.date === day.date);
      const dayActivity = activityData.filter(entry => entry.date === day.date);

      const dayCalories = dayNutrition.reduce((sum, entry) => sum + (parseInt(entry.calories) || 0), 0);
      const dayActivityMinutes = dayActivity.reduce((sum, entry) => sum + (parseInt(entry.duration) || 0), 0);
      const dayCaloriesBurned = dayActivity.reduce((sum, entry) => sum + (parseInt(entry.caloriesBurned) || 0), 0);

      return {
        ...day,
        meals: dayNutrition.length,
        activities: dayActivity.length,
        calories: dayCalories,
        activityMinutes: dayActivityMinutes,
        caloriesBurned: dayCaloriesBurned,
        netCalories: dayCalories - dayCaloriesBurned,
        isActive: dayNutrition.length > 0 || dayActivity.length > 0
      };
    });
  };

  // Add a new function to get trends based on current time range
  const getTrendsData = () => {
    const daysInRange = getDaysInRange();
    
    if (timeRange === 'week') {
      return getWeeklyTrends();
    } else {
      // For month and quarter, show data for all days in range
      return daysInRange.map(date => {
        const dayDate = new Date(date);
        const dayNutrition = nutritionData.filter(entry => entry.date === date);
        const dayActivity = activityData.filter(entry => entry.date === date);

        const dayCalories = dayNutrition.reduce((sum, entry) => sum + (parseInt(entry.calories) || 0), 0);
        const dayActivityMinutes = dayActivity.reduce((sum, entry) => sum + (parseInt(entry.duration) || 0), 0);
        const dayCaloriesBurned = dayActivity.reduce((sum, entry) => sum + (parseInt(entry.caloriesBurned) || 0), 0);

        return {
          date: date,
          day: dayDate.toLocaleDateString('en-US', { weekday: 'short' }),
          fullDay: dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          meals: dayNutrition.length,
          activities: dayActivity.length,
          calories: dayCalories,
          activityMinutes: dayActivityMinutes,
          caloriesBurned: dayCaloriesBurned,
          netCalories: dayCalories - dayCaloriesBurned,
          isActive: dayNutrition.length > 0 || dayActivity.length > 0
        };
      });
    }
  };

  const getNutritionBalance = () => {
    const totalProtein = nutritionData.reduce((sum, entry) => sum + (parseFloat(entry.protein) || 0), 0);
    const totalCarbs = nutritionData.reduce((sum, entry) => sum + (parseFloat(entry.carbs) || 0), 0);
    const totalFat = nutritionData.reduce((sum, entry) => sum + (parseFloat(entry.fat) || 0), 0);
    const totalMacros = totalProtein + totalCarbs + totalFat;

    if (totalMacros === 0) return { protein: 33, carbs: 33, fat: 34 };

    return {
      protein: Math.round((totalProtein / totalMacros) * 100),
      carbs: Math.round((totalCarbs / totalMacros) * 100),
      fat: Math.round((totalFat / totalMacros) * 100)
    };
  };

  const metrics = calculateMetrics();
  const mealInsights = getMealTypeInsights();
  const activityInsights = getActivityInsights();
  const trendsData = getTrendsData();
  const nutritionBalance = getNutritionBalance();

  const progressCards = [
    {
      title: "Meals Tracked",
      value: metrics.totalMeals,
      subtitle: `${metrics.avgDailyCalories} avg calories/day`,
      change: `${metrics.mealsProgress}% of goal`,
      icon: "🍽️",
      color: "#F59E0B",
      progress: metrics.mealsProgress,
      path: "/nutrition"
    },
    {
      title: "Activities Logged",
      value: metrics.totalActivities,
      subtitle: `${metrics.avgDailyActivity} avg minutes/day`,
      change: `${metrics.activityProgress}% of goal`,
      icon: "💪",
      color: "#10B981",
      progress: metrics.activityProgress,
      path: "/activity"
    },
    {
      title: "Current Streak",
      value: `${metrics.currentStreak} days`,
      subtitle: `Best: ${metrics.bestStreak} days`,
      change: `${metrics.consistencyScore}% consistency`,
      icon: "🔥",
      color: "#EF4444",
      progress: metrics.consistencyScore,
      path: "/nutrition"
    },
    {
      title: "Active Days",
      value: `${metrics.activeDays}/${metrics.totalDays}`,
      subtitle: `${Math.round((metrics.activeDays / metrics.totalDays) * 100)}% active`,
      change: `${metrics.totalCaloriesBurned} cal burned`,
      icon: "📊",
      color: "#3B82F6",
      progress: Math.round((metrics.activeDays / metrics.totalDays) * 100),
      path: "/activity"
    },
    {
      title: "Avg Meal Calories",
      value: metrics.avgCaloriesPerMeal,
      subtitle: "Per meal average",
      change: `${metrics.totalMeals} total meals`,
      icon: "⚡",
      color: "#8B5CF6",
      progress: Math.min((metrics.avgCaloriesPerMeal / 600) * 100, 100),
      path: "/nutrition"
    },
    {
      title: "Calorie Efficiency",
      value: metrics.avgCaloriesPerActivity,
      subtitle: "Calories burned per activity",
      change: `${metrics.totalActivities} total activities`,
      icon: "🎯",
      color: "#06B6D4",
      progress: Math.min((metrics.avgCaloriesPerActivity / 300) * 100, 100),
      path: "/activity"
    }
  ];

  const metricTabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'nutrition', label: 'Nutrition', icon: '🍎' },
    { id: 'activity', label: 'Activity', icon: '💪' },
    { id: 'trends', label: 'Trends', icon: '📈' }
  ];

  const getAchievements = () => {
    const achievements = [];
    
    // Unlocked achievements
    if (metrics.currentStreak >= 3) {
      achievements.push({
        title: "Consistency Champion",
        description: `${metrics.currentStreak}-day tracking streak!`,
        icon: "🔥",
        unlocked: true
      });
    }
    
    if (metrics.totalMeals >= 5) {
      achievements.push({
        title: "Nutrition Pro",
        description: "Tracked 5+ meals",
        icon: "🍽️",
        unlocked: true
      });
    }
    
    if (metrics.totalActivities >= 3) {
      achievements.push({
        title: "Active Lifestyle",
        description: "Logged 3+ activities",
        icon: "🏃‍♂️",
        unlocked: true
      });
    }
    
    if (metrics.consistencyScore >= 50) {
      achievements.push({
        title: "Dedicated Tracker",
        description: "50%+ consistency score",
        icon: "⭐",
        unlocked: true
      });
    }

    if (metrics.avgCaloriesPerMeal >= 400 && metrics.totalMeals >= 3) {
      achievements.push({
        title: "Balanced Eater",
        description: "Maintains good meal calories",
        icon: "⚖️",
        unlocked: true
      });
    }

    if (metrics.avgCaloriesPerActivity >= 200 && metrics.totalActivities >= 2) {
      achievements.push({
        title: "Efficient Worker",
        description: "Good calorie burn efficiency",
        icon: "🎯",
        unlocked: true
      });
    }

    // Locked achievements - Ensure we have 6 total
    if (metrics.currentStreak < 7) {
      achievements.push({
        title: "Weekly Warrior",
        description: "Maintain a 7-day streak",
        icon: "🎯",
        unlocked: false,
        progress: Math.round((metrics.currentStreak / 7) * 100)
      });
    }

    if (metrics.totalMeals < 20) {
      achievements.push({
        title: "Meal Master",
        description: "Track 20 meals",
        icon: "👑",
        unlocked: false,
        progress: Math.round((metrics.totalMeals / 20) * 100)
      });
    }

    if (metrics.totalActivities < 10) {
      achievements.push({
        title: "Fitness Enthusiast",
        description: "Log 10 activities",
        icon: "💪",
        unlocked: false,
        progress: Math.round((metrics.totalActivities / 10) * 100)
      });
    }

    if (metrics.avgCaloriesPerMeal < 500) {
      achievements.push({
        title: "Calorie Expert",
        description: "Achieve 500+ avg calories per meal",
        icon: "📈",
        unlocked: false,
        progress: Math.round((metrics.avgCaloriesPerMeal / 500) * 100)
      });
    }

    if (metrics.avgCaloriesPerActivity < 400) {
      achievements.push({
        title: "Power Performer",
        description: "Burn 400+ avg calories per activity",
        icon: "🚀",
        unlocked: false,
        progress: Math.round((metrics.avgCaloriesPerActivity / 400) * 100)
      });
    }

    // Add one more achievement to ensure 6 total
    if (metrics.activeDays < metrics.totalDays * 0.8) {
      achievements.push({
        title: "Daily Tracker",
        description: "Track 80% of days",
        icon: "📅",
        unlocked: false,
        progress: Math.round((metrics.activeDays / (metrics.totalDays * 0.8)) * 100)
      });
    }

    return achievements.slice(0, 6); // Ensure exactly 6 achievements
  };

  const achievements = getAchievements();

  const renderOverview = () => (
    <div className="overview-content">
      {/* Progress Cards */}
      <div className="progress-cards-grid">
        {progressCards.map((card, index) => (
          <div 
            key={index} 
            className="progress-card clickable"
            onClick={() => navigate(card.path)}
            style={{ '--progress-color': card.color, '--progress': `${card.progress}%` }}
          >
            <div className="card-header">
              <div className="card-icon" style={{ backgroundColor: card.color + '20' }}>
                {card.icon}
              </div>
              <div className="card-progress">
                <div className="progress-ring">
                  <div className="progress-circle">
                    <span>{Math.round(card.progress)}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-content">
              <h3>{card.title}</h3>
              <div className="card-value">{card.value}</div>
              <p>{card.subtitle}</p>
              <div className="card-change">{card.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Trends Section - Updated to show time range specific trends */}
      <div className="trends-section">
        <h3>
          {timeRange === 'week' ? 'Weekly' : timeRange === 'month' ? 'Monthly' : 'Quarterly'} 
          Activity Trends
        </h3>
        <div className={`trends-grid ${timeRange !== 'week' ? 'scrollable' : ''}`}>
          {trendsData.map((day, index) => (
            <div key={index} className={`trend-day ${day.isActive ? 'active' : 'inactive'}`}>
              <div className="day-label">{timeRange === 'week' ? day.day : day.fullDay}</div>
              <div className="day-metrics">
                <div className="metric-bubble meals" style={{ '--size': Math.min(day.meals * 2 + 1, 8) }}>
                  <span>{day.meals}</span>
                </div>
                <div className="metric-bubble activities" style={{ '--size': Math.min(day.activities * 3 + 1, 8) }}>
                  <span>{day.activities}</span>
                </div>
              </div>
              <div className="day-calories">
                {day.calories > 0 && <span className="calories-in">+{day.calories}</span>}
                {day.caloriesBurned > 0 && <span className="calories-out">-{day.caloriesBurned}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="achievements-section">
          <h3>🏆 Your Achievements</h3>
          <div className="achievements-grid">
            {achievements.map((achievement, index) => (
              <div key={index} className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}>
                <div className="achievement-icon">
                  {achievement.icon}
                  {!achievement.unlocked && <div className="lock-icon">🔒</div>}
                </div>
                <div className="achievement-content">
                  <h4>{achievement.title}</h4>
                  <p>{achievement.description}</p>
                  {achievement.progress && (
                    <div className="achievement-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${achievement.progress}%` }}
                        ></div>
                      </div>
                      <span>{achievement.progress}%</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderNutrition = () => (
    <div className="nutrition-content">
      {nutritionData.length > 0 ? (
        <div className="nutrition-grid">
          {/* Macronutrient Balance */}
          <div className="macro-balance-card">
            <h3>🥗 Macronutrient Balance</h3>
            <p style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '0.9rem', 
              marginBottom: '1rem',
              fontStyle: 'italic'
            }}>
              {timeRange === 'week' ? 'This Week' : timeRange === 'month' ? 'This Month' : 'This Quarter'}
            </p>
            <div className="macro-chart">
              <div className="macro-protein" style={{ '--percentage': nutritionBalance.protein + '%' }}>
                <span>Protein</span>
                <strong>{nutritionBalance.protein}%</strong>
              </div>
              <div className="macro-carbs" style={{ '--percentage': nutritionBalance.carbs + '%' }}>
                <span>Carbs</span>
                <strong>{nutritionBalance.carbs}%</strong>
              </div>
              <div className="macro-fat" style={{ '--percentage': nutritionBalance.fat + '%' }}>
                <span>Fat</span>
                <strong>{nutritionBalance.fat}%</strong>
              </div>
            </div>
          </div>

          {/* Meal Distribution */}
          <div className="meal-distribution-card">
            <h3>🍽️ Meal Distribution</h3>
            <p style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '0.9rem', 
              marginBottom: '1rem',
              fontStyle: 'italic'
            }}>
              {timeRange === 'week' ? 'This Week' : timeRange === 'month' ? 'This Month' : 'This Quarter'}
            </p>
            <div className="distribution-list">
              {mealInsights.length > 0 ? (
                mealInsights.map((meal, index) => (
                  <div key={index} className="distribution-item">
                    <div className="meal-info">
                      <span className="meal-type">{meal.type}</span>
                      <span className="meal-count">{meal.count} meals</span>
                    </div>
                    <div className="meal-details">
                      <span className="meal-calories">{meal.avgCalories} avg cal</span>
                      <span className="meal-percentage">{meal.percentage}%</span>
                    </div>
                    <div className="distribution-bar">
                      <div 
                        className="distribution-fill"
                        style={{ width: `${meal.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-data" style={{ padding: '1rem', margin: 0 }}>
                  <p>No meals in {timeRange === 'week' ? 'this week' : timeRange === 'month' ? 'this month' : 'this quarter'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Nutrition Summary */}
          <div className="nutrition-summary-card">
            <h3>📊 Nutrition Summary</h3>
            <p style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '0.9rem', 
              marginBottom: '1rem',
              fontStyle: 'italic'
            }}>
              {timeRange === 'week' ? 'Weekly Overview' : timeRange === 'month' ? 'Monthly Overview' : 'Quarterly Overview'}
            </p>
            <div className="summary-stats">
              <div className="summary-stat">
                <span className="stat-label">Total Calories</span>
                <span className="stat-value">{metrics.totalCalories}</span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Avg Daily Calories</span>
                <span className="stat-value">{metrics.avgDailyCalories}</span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Total Protein</span>
                <span className="stat-value">{metrics.totalProtein}g</span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Total Carbs</span>
                <span className="stat-value">{metrics.totalCarbs}g</span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Total Fat</span>
                <span className="stat-value">{metrics.totalFat}g</span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Avg Calories/Meal</span>
                <span className="stat-value">{metrics.avgCaloriesPerMeal}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-data">
          <p>No nutrition data available yet</p>
          <p>Start tracking your meals to see analytics</p>
          <button onClick={() => navigate('/nutrition')}>
            Track Your First Meal
          </button>
        </div>
      )}
    </div>
  );

  const renderActivity = () => (
    <div className="activity-content">
      {activityData.length > 0 ? (
        <div className="activity-grid">
          {/* Activity Distribution */}
          <div className="activity-distribution-card">
            <h3>💪 Activity Types</h3>
            <p style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '0.9rem', 
              marginBottom: '1rem',
              fontStyle: 'italic'
            }}>
              {timeRange === 'week' ? 'This Week' : timeRange === 'month' ? 'This Month' : 'This Quarter'}
            </p>
            <div className="activity-list">
              {activityInsights.length > 0 ? (
                activityInsights.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-header">
                      <span className="activity-type">{activity.type}</span>
                      <span className="activity-count">{activity.count} times</span>
                    </div>
                    <div className="activity-details">
                      <span className="activity-duration">{activity.avgDuration} min avg</span>
                      <span className="activity-calories">{activity.avgCalories} cal avg</span>
                      <span className="activity-percentage">{activity.percentage}%</span>
                    </div>
                    <div className="distribution-bar">
                      <div 
                        className="distribution-fill"
                        style={{ width: `${activity.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-data" style={{ padding: '1rem', margin: 0 }}>
                  <p>No activities in {timeRange === 'week' ? 'this week' : timeRange === 'month' ? 'this month' : 'this quarter'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Activity Summary */}
          <div className="activity-summary-card">
            <h3>📈 Activity Summary</h3>
            <p style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '0.9rem', 
              marginBottom: '1rem',
              fontStyle: 'italic'
            }}>
              {timeRange === 'week' ? 'Weekly Overview' : timeRange === 'month' ? 'Monthly Overview' : 'Quarterly Overview'}
            </p>
            <div className="activity-stats">
              <div className="activity-stat">
                <div className="stat-icon">⏱️</div>
                <div className="stat-info">
                  <span className="stat-label">Total Minutes</span>
                  <span className="stat-value">{metrics.totalActivityMinutes}</span>
                </div>
              </div>
              <div className="activity-stat">
                <div className="stat-icon">🔥</div>
                <div className="stat-info">
                  <span className="stat-label">Calories Burned</span>
                  <span className="stat-value">{metrics.totalCaloriesBurned}</span>
                </div>
              </div>
              <div className="activity-stat">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <span className="stat-label">Avg Daily Activity</span>
                  <span className="stat-value">{metrics.avgDailyActivity} min</span>
                </div>
              </div>
              <div className="activity-stat">
                <div className="stat-icon">🎯</div>
                <div className="stat-info">
                  <span className="stat-label">Goal Progress</span>
                  <span className="stat-value">{metrics.activityProgress}%</span>
                </div>
              </div>
              <div className="activity-stat">
                <div className="stat-icon">⚡</div>
                <div className="stat-info">
                  <span className="stat-label">Avg Calories/Activity</span>
                  <span className="stat-value">{metrics.avgCaloriesPerActivity}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-data">
          <p>No activity data available yet</p>
          <p>Start logging activities to see analytics</p>
          <button onClick={() => navigate('/activity')}>
            Log Your First Activity
          </button>
        </div>
      )}
    </div>
  );

  const renderTrends = () => (
    <div className="trends-content">
      {(nutritionData.length > 0 || activityData.length > 0) ? (
        <div className="trends-grid-full">
          {/* Daily Net Calories */}
          <div className="trend-card large">
            <h3>🔥 Daily Net Calories</h3>
            <div className={`calories-trend ${timeRange !== 'week' ? 'scrollable' : ''}`}>
              {trendsData.map((day, index) => (
                <div key={index} className="calories-day">
                  <div className="day-label">{timeRange === 'week' ? day.day : day.fullDay}</div>
                  <div className="calories-bars">
                    {day.calories > 0 && (
                      <div 
                        className="calories-in-bar"
                        style={{ height: `${Math.min(day.calories / 50, 100)}%` }}
                        title={`${day.calories} cal in`}
                      ></div>
                    )}
                    {day.caloriesBurned > 0 && (
                      <div 
                        className="calories-out-bar"
                        style={{ height: `${Math.min(day.caloriesBurned / 50, 100)}%` }}
                        title={`${day.caloriesBurned} cal out`}
                      ></div>
                    )}
                  </div>
                  <div className="net-calories">
                    {day.netCalories > 0 ? '+' : ''}{day.netCalories}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Consistency Chart */}
          <div className="trend-card">
            <h3>📅 Tracking Consistency</h3>
            <div className={`consistency-chart ${timeRange !== 'week' ? 'scrollable' : ''}`}>
              {trendsData.map((day, index) => (
                <div key={index} className="consistency-day">
                  <div className="day-label">{timeRange === 'week' ? day.day : day.fullDay}</div>
                  <div className={`consistency-dot ${day.isActive ? 'active' : 'inactive'}`}>
                    {day.isActive ? '✓' : '○'}
                  </div>
                  <div className="day-score">
                    {day.meals + day.activities}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-data">
          <p>No data available for trends analysis</p>
          <p>Start tracking meals and activities to see trends</p>
          <div className="action-buttons" style={{flexDirection: 'column', marginTop: '1rem'}}>
            <button className="action-btn primary" onClick={() => navigate('/nutrition')}>
              Track Meals
            </button>
            <button className="action-btn secondary" onClick={() => navigate('/activity')}>
              Log Activities
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="analytics-page">
      <div className="analytics-container">
        <aside className="analytics-sidebar">
          <Navigation />
        </aside>

        <main className="analytics-main">
          {/* Header */}
          <div className="analytics-header">
            <div className="header-content">
              <h1>📊 Progress Analytics</h1>
              <p>Real-time insights from your wellness journey</p>
              <small style={{color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem'}}>
                Tracking {nutritionData.length} meals & {activityData.length} activities
              </small>
            </div>
            <div className="header-controls">
              <div className="time-range-selector">
                {['week', 'month', 'quarter'].map(range => (
                  <button
                    key={range}
                    className={`time-btn ${timeRange === range ? 'active' : ''}`}
                    onClick={() => setTimeRange(range)}
                  >
                    This {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Metric Tabs */}
          <div className="metric-tabs">
            {metricTabs.map(tab => (
              <button
                key={tab.id}
                className={`metric-tab ${selectedMetric === tab.id ? 'active' : ''}`}
                onClick={() => setSelectedMetric(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="analytics-content">
            {selectedMetric === 'overview' && renderOverview()}
            {selectedMetric === 'nutrition' && renderNutrition()}
            {selectedMetric === 'activity' && renderActivity()}
            {selectedMetric === 'trends' && renderTrends()}
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h3>🚀 Quick Actions</h3>
            <div className="action-buttons">
              <button className="action-btn primary" onClick={() => navigate('/nutrition')}>
                <span className="btn-icon">🍽️</span>
                Add Today's Meals
              </button>
              <button className="action-btn secondary" onClick={() => navigate('/activity')}>
                <span className="btn-icon">💪</span>
                Log Activity
              </button>
              <button className="action-btn outline" onClick={loadUserData}>
                <span className="btn-icon">🔄</span>
                Refresh Data
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Analytics;