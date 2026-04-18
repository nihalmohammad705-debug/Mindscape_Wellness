import React, { useState } from 'react';
import './ActivityForm.css';

const ActivityForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    activityType: '',
    customActivity: '',
    customCalories: '',
    duration: '',
    intensity: 'moderate',
    notes: ''
  });
  const [showCustomActivity, setShowCustomActivity] = useState(false);
  const [useCustomCalories, setUseCustomCalories] = useState(false);

  const activityTypes = [
    { id: 1, name: 'Walking', calories: 280, category: 'exercise' },
    { id: 2, name: 'Running', calories: 600, category: 'exercise' },
    { id: 3, name: 'Cycling', calories: 500, category: 'exercise' },
    { id: 4, name: 'Yoga', calories: 240, category: 'exercise' },
    { id: 5, name: 'Weight Training', calories: 400, category: 'exercise' },
    { id: 6, name: 'Swimming', calories: 550, category: 'exercise' },
    { id: 7, name: 'Office Work', calories: 100, category: 'work' },
    { id: 8, name: 'House Cleaning', calories: 200, category: 'work' },
    { id: 9, name: 'Sleeping', calories: 50, category: 'rest' },
    { id: 10, name: 'Others', calories: 200, category: 'other' }
  ];

  const intensities = [
    { value: 'light', label: '💚 Light' },
    { value: 'moderate', label: '💛 Moderate' },
    { value: 'vigorous', label: '❤️ Vigorous' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'activityType') {
      const isOthers = value === '10';
      setShowCustomActivity(isOthers);
      setUseCustomCalories(false);
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        customActivity: isOthers ? prev.customActivity : '',
        customCalories: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let activityName;
    let caloriesBurned;

    if (formData.activityType === '10') {
      // Custom activity
      if (!formData.customActivity.trim()) {
        alert('Please enter a custom activity name');
        return;
      }
      if (!formData.duration) {
        alert('Please enter duration');
        return;
      }
      activityName = formData.customActivity.trim();
      
      if (useCustomCalories && formData.customCalories) {
        // Use custom calories directly
        caloriesBurned = parseInt(formData.customCalories);
      } else {
        // Calculate based on duration and default rate
        const defaultCaloriesPerHour = 200;
        caloriesBurned = Math.round((defaultCaloriesPerHour * parseFloat(formData.duration)) / 60);
      }
    } else {
      // Predefined activity
      const selectedActivity = activityTypes.find(activity => activity.id === parseInt(formData.activityType));
      if (!selectedActivity) {
        alert('Please select an activity type');
        return;
      }
      if (!formData.duration) {
        alert('Please enter duration');
        return;
      }
      activityName = selectedActivity.name;
      caloriesBurned = Math.round((selectedActivity.calories * parseFloat(formData.duration)) / 60);
    }
    
    const entry = {
      ...formData,
      activityName: activityName,
      caloriesBurned: caloriesBurned,
      isCustom: formData.activityType === '10'
    };
    
    console.log('Submitting activity:', entry);
    onSubmit(entry);
    
    // Reset form
    setFormData({
      activityType: '',
      customActivity: '',
      customCalories: '',
      duration: '',
      intensity: 'moderate',
      notes: ''
    });
    setShowCustomActivity(false);
    setUseCustomCalories(false);
  };

  const selectedActivity = formData.activityType !== '10' 
    ? activityTypes.find(activity => activity.id === parseInt(formData.activityType))
    : { calories: 200 };

  const estimatedCalories = formData.duration ? 
    (useCustomCalories && formData.customCalories ? 
      parseInt(formData.customCalories) : 
      Math.round((selectedActivity?.calories || 200) * parseFloat(formData.duration) / 60)
    ) : 0;

  return (
    <form className="activity-form" onSubmit={handleSubmit}>
      <h3>Log Physical Activity</h3>
      
      <div className="form-group">
        <label>Activity Type:</label>
        <select
          name="activityType"
          value={formData.activityType}
          onChange={handleChange}
          className="form-input"
          required
        >
          <option value="">Select an activity</option>
          {activityTypes.map(activity => (
            <option key={activity.id} value={activity.id}>
              {activity.name} - {activity.calories} cal/hour
            </option>
          ))}
        </select>
      </div>

      {/* Custom Activity Section */}
      {showCustomActivity && (
        <div className="custom-activity-section">
          <div className="form-group">
            <label>Custom Activity Name:</label>
            <input
              type="text"
              name="customActivity"
              value={formData.customActivity}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your custom activity (e.g., Dancing, Basketball, Gardening...)"
              required
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={useCustomCalories}
                onChange={(e) => setUseCustomCalories(e.target.checked)}
              />
              <span>Enter custom calories instead of using calculation</span>
            </label>
          </div>

          {useCustomCalories && (
            <div className="form-group">
              <label>Custom Calories Burned:</label>
              <input
                type="number"
                name="customCalories"
                value={formData.customCalories}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter total calories burned"
                min="1"
                required={useCustomCalories}
              />
            </div>
          )}
        </div>
      )}

      <div className="form-group">
        <label>Duration (minutes):</label>
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          className="form-input"
          placeholder="Enter duration in minutes"
          min="1"
          required
        />
      </div>

      <div className="form-group">
        <label>Intensity Level:</label>
        <div className="intensity-options">
          {intensities.map(intensity => (
            <label key={intensity.value} className="intensity-option">
              <input
                type="radio"
                name="intensity"
                value={intensity.value}
                checked={formData.intensity === intensity.value}
                onChange={handleChange}
              />
              <span>{intensity.label}</span>
            </label>
          ))}
        </div>
      </div>

      {formData.duration && (
        <div className="calorie-estimate">
          <p>Estimated Calories Burned: <strong>{estimatedCalories} cal</strong></p>
          {showCustomActivity && !useCustomCalories && (
            <small style={{color: '#742a2a'}}>
              Based on 200 calories/hour for custom activity. Check "Enter custom calories" to override.
            </small>
          )}
          {showCustomActivity && useCustomCalories && (
            <small style={{color: '#742a2a'}}>
              Using custom calorie entry.
            </small>
          )}
        </div>
      )}

      <div className="form-group">
        <label>Notes (optional):</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="form-textarea"
          placeholder="How did the activity feel? Any observations?"
          rows="2"
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Log Activity
      </button>
    </form>
  );
};

export default ActivityForm;