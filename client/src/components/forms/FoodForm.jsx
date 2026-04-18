import React, { useState } from 'react';
import './FoodForm.css';

const FoodForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    mealType: 'breakfast',
    foodItem: '',
    quantity: '',
    notes: '',
    customFoodName: '',
    customCalories: '',
    customProtein: '',
    customCarbs: '',
    customFat: '',
    customUnit: 'g'
  });

  const [showCustomForm, setShowCustomForm] = useState(false);

  const mealTypes = [
    { value: 'breakfast', label: '🍳 Breakfast', color: '#FBBF24' },
    { value: 'lunch', label: '🍲 Lunch', color: '#10B981' },
    { value: 'dinner', label: '🍽️ Dinner', color: '#3B82F6' },
    { value: 'snacks', label: '🍎 Snacks', color: '#8B5CF6' },
    { value: 'other', label: '🥤 Other', color: '#6B7280' }
  ];

  const foodItems = [
    { id: 1, name: 'Idly', calories: 35, protein: 1, carbs: 7, fat: 0.2, unit: 'piece' },
    { id: 2, name: 'Dosa', calories: 120, protein: 3, carbs: 18, fat: 4, unit: 'piece' },
    { id: 3, name: 'Rice', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, unit: '100g' },
    { id: 4, name: 'Chapati', calories: 70, protein: 3, carbs: 12, fat: 1, unit: 'piece' },
    { id: 5, name: 'Egg', calories: 78, protein: 6, carbs: 0.6, fat: 5, unit: 'piece' },
    { id: 6, name: 'Milk', calories: 42, protein: 3.4, carbs: 5, fat: 1, unit: '100ml' },
    { id: 7, name: 'Apple', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, unit: 'piece' },
    { id: 8, name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, unit: 'piece' },
    { id: 9, name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, unit: '100g' },
    { id: 10, name: 'Salmon', calories: 206, protein: 22, carbs: 0, fat: 13, unit: '100g' },
    { id: 11, name: 'Yogurt', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, unit: '100g' },
    { id: 12, name: 'Almonds', calories: 579, protein: 21, carbs: 22, fat: 50, unit: '100g' },
    { id: 13, name: 'Oats', calories: 389, protein: 16.9, carbs: 66, fat: 6.9, unit: '100g' },
    { id: 14, name: 'Bread', calories: 265, protein: 9, carbs: 49, fat: 3.2, unit: 'slice' },
    { id: 15, name: 'Pasta', calories: 131, protein: 5, carbs: 25, fat: 1, unit: '100g' },
    { id: 'custom', name: 'Other Custom Food', calories: 0, protein: 0, carbs: 0, fat: 0, unit: 'g' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Show custom form when "Other Custom Food" is selected
    if (name === 'foodItem' && value === 'custom') {
      setShowCustomForm(true);
    } else if (name === 'foodItem' && value !== 'custom') {
      setShowCustomForm(false);
    }
  };

  const handleMealTypeChange = (mealType) => {
    setFormData({
      ...formData,
      mealType,
      foodItem: '',
      customFoodName: '',
      customCalories: '',
      customProtein: '',
      customCarbs: '',
      customFat: ''
    });
    setShowCustomForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let entry;

    if (showCustomForm) {
      // Custom food entry for any meal type
      const quantity = parseFloat(formData.quantity) || 0;
      entry = {
        mealType: formData.mealType,
        foodName: formData.customFoodName,
        calories: Math.round(parseFloat(formData.customCalories || 0) * quantity),
        protein: Math.round(parseFloat(formData.customProtein || 0) * quantity * 10) / 10,
        carbs: Math.round(parseFloat(formData.customCarbs || 0) * quantity * 10) / 10,
        fat: Math.round(parseFloat(formData.customFat || 0) * quantity * 10) / 10,
        notes: formData.notes,
        isCustom: true
      };
    } else {
      // Predefined food entry
      const selectedFood = foodItems.find(food => food.id === parseInt(formData.foodItem));
      if (!selectedFood) return;

      const quantity = parseFloat(formData.quantity) || 0;
      entry = {
        ...formData,
        foodName: selectedFood.name,
        calories: Math.round(selectedFood.calories * quantity),
        protein: Math.round(selectedFood.protein * quantity * 10) / 10,
        carbs: Math.round(selectedFood.carbs * quantity * 10) / 10,
        fat: Math.round(selectedFood.fat * quantity * 10) / 10,
        isCustom: false
      };
    }
    
    onSubmit(entry);
    
    // Reset form but keep meal type
    setFormData({
      mealType: formData.mealType,
      foodItem: '',
      quantity: '',
      notes: '',
      customFoodName: '',
      customCalories: '',
      customProtein: '',
      customCarbs: '',
      customFat: '',
      customUnit: 'g'
    });
    
    setShowCustomForm(false);
  };

  const selectedFood = foodItems.find(food => 
    food.id === (formData.foodItem === 'custom' ? 'custom' : parseInt(formData.foodItem))
  );
  const quantity = parseFloat(formData.quantity) || 0;

  const getNutritionPreview = () => {
    if (showCustomForm) {
      const qty = parseFloat(formData.quantity) || 0;
      return {
        calories: Math.round(parseFloat(formData.customCalories || 0) * qty),
        protein: Math.round(parseFloat(formData.customProtein || 0) * qty * 10) / 10,
        carbs: Math.round(parseFloat(formData.customCarbs || 0) * qty * 10) / 10,
        fat: Math.round(parseFloat(formData.customFat || 0) * qty * 10) / 10
      };
    } else if (selectedFood && quantity > 0 && formData.foodItem !== 'custom') {
      return {
        calories: Math.round(selectedFood.calories * quantity),
        protein: Math.round(selectedFood.protein * quantity * 10) / 10,
        carbs: Math.round(selectedFood.carbs * quantity * 10) / 10,
        fat: Math.round(selectedFood.fat * quantity * 10) / 10
      };
    }
    return null;
  };

  const nutritionPreview = getNutritionPreview();

  return (
    <form className="food-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>🍽️ Add Food Entry</h3>
        <p>Track your meal and nutrition intake</p>
      </div>
      
      <div className="form-group">
        <label className="form-label">Meal Type</label>
        <div className="meal-type-selector">
          {mealTypes.map(meal => (
            <label key={meal.value} className="meal-option">
              <input
                type="radio"
                name="mealType"
                value={meal.value}
                checked={formData.mealType === meal.value}
                onChange={(e) => handleMealTypeChange(e.target.value)}
              />
              <span className="meal-label" style={{ borderColor: meal.color }}>
                {meal.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Food Item</label>
        <select
          name="foodItem"
          value={formData.foodItem}
          onChange={handleChange}
          className="form-input"
          required
        >
          <option value="">Select a food item</option>
          {foodItems.map(food => (
            <option key={food.id} value={food.id}>
              {food.name} {food.id !== 'custom' ? `- ${food.calories} cal/${food.unit}` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Custom Food Form - Show for any meal type when "Other Custom Food" is selected */}
      {showCustomForm && (
        <div className="custom-food-form">
          <div className="form-group">
            <label className="form-label">Custom Food Name</label>
            <input
              type="text"
              name="customFoodName"
              value={formData.customFoodName}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter custom food name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nutrition per 100g</label>
            <div className="nutrition-inputs-grid">
              <div className="nutrition-input-group">
                <label className="nutrition-label">Calories</label>
                <input
                  type="number"
                  name="customCalories"
                  value={formData.customCalories}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="0"
                  min="0"
                  step="1"
                  required
                />
                <span className="nutrition-unit">kcal</span>
              </div>
              <div className="nutrition-input-group">
                <label className="nutrition-label">Protein</label>
                <input
                  type="number"
                  name="customProtein"
                  value={formData.customProtein}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="0"
                  min="0"
                  step="0.1"
                  required
                />
                <span className="nutrition-unit">g</span>
              </div>
              <div className="nutrition-input-group">
                <label className="nutrition-label">Carbs</label>
                <input
                  type="number"
                  name="customCarbs"
                  value={formData.customCarbs}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="0"
                  min="0"
                  step="0.1"
                  required
                />
                <span className="nutrition-unit">g</span>
              </div>
              <div className="nutrition-input-group">
                <label className="nutrition-label">Fat</label>
                <input
                  type="number"
                  name="customFat"
                  value={formData.customFat}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="0"
                  min="0"
                  step="0.1"
                  required
                />
                <span className="nutrition-unit">g</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Quantity (in grams)</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter quantity in grams"
              min="0"
              step="1"
              required
            />
          </div>
        </div>
      )}

      {/* Standard Food Quantity Input - Show when not using custom form */}
      {!showCustomForm && formData.foodItem && (
        <div className="form-group">
          <label className="form-label">Quantity</label>
          <div className="quantity-input-wrapper">
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter quantity"
              min="0"
              step="0.1"
              required
            />
            {selectedFood && selectedFood.id !== 'custom' && (
              <span className="unit-display">{selectedFood.unit}</span>
            )}
          </div>
        </div>
      )}

      {nutritionPreview && (
        <div className="nutrition-preview">
          <h4>Nutrition Summary</h4>
          <div className="preview-grid">
            <div className="preview-item calories">
              <span className="preview-label">Calories</span>
              <span className="preview-value">{nutritionPreview.calories}</span>
              <span className="preview-unit">kcal</span>
            </div>
            <div className="preview-item protein">
              <span className="preview-label">Protein</span>
              <span className="preview-value">{nutritionPreview.protein}</span>
              <span className="preview-unit">g</span>
            </div>
            <div className="preview-item carbs">
              <span className="preview-label">Carbs</span>
              <span className="preview-value">{nutritionPreview.carbs}</span>
              <span className="preview-unit">g</span>
            </div>
            <div className="preview-item fat">
              <span className="preview-label">Fat</span>
              <span className="preview-value">{nutritionPreview.fat}</span>
              <span className="preview-unit">g</span>
            </div>
          </div>
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Notes (optional)</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="form-textarea"
          placeholder="Any additional notes about this meal (preparation, time, how you felt...)"
          rows="3"
        />
      </div>

      <button type="submit" className="btn btn-primary submit-btn">
        ➕ Add Food Entry
      </button>
    </form>
  );
};

export default FoodForm;