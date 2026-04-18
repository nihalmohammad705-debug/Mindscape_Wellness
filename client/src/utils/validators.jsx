// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password) => {
  return password.length >= 6;
};

// Name validation
export const validateName = (name) => {
  return name.trim().length >= 2;
};

// Unique ID validation
export const validateUniqueId = (uniqueId) => {
  const uniqueIdRegex = /^MW[A-Za-z0-9]{8,12}$/;
  return uniqueIdRegex.test(uniqueId);
};

// Height validation (in cm)
export const validateHeight = (height) => {
  const num = parseFloat(height);
  return !isNaN(num) && num >= 100 && num <= 250;
};

// Weight validation (in kg)
export const validateWeight = (weight) => {
  const num = parseFloat(weight);
  return !isNaN(num) && num >= 30 && num <= 300;
};

// Date of birth validation
export const validateDateOfBirth = (date) => {
  if (!date) return true; // Optional field
  
  const birthDate = new Date(date);
  const today = new Date();
  const minDate = new Date();
  minDate.setFullYear(today.getFullYear() - 120); // 120 years ago
  const maxDate = new Date();
  maxDate.setFullYear(today.getFullYear() - 13); // At least 13 years old
  
  return birthDate >= minDate && birthDate <= maxDate;
};

// Form validation helper
export const validateForm = (formData, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = formData[field];
    const rule = rules[field];
    
    if (rule.required && (!value || value.toString().trim() === '')) {
      errors[field] = rule.required;
    } else if (rule.validate && value) {
      const validationResult = rule.validate(value);
      if (validationResult !== true) {
        errors[field] = validationResult;
      }
    } else if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = rule.minLengthMessage || `Must be at least ${rule.minLength} characters`;
    } else if (rule.maxLength && value && value.length > rule.maxLength) {
      errors[field] = rule.maxLengthMessage || `Must be less than ${rule.maxLength} characters`;
    } else if (rule.match && value !== formData[rule.match]) {
      errors[field] = rule.matchMessage || 'Fields do not match';
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Registration form validation rules
export const registrationRules = {
  name: {
    required: 'Name is required',
    validate: validateName,
    minLength: 2,
    minLengthMessage: 'Name must be at least 2 characters long'
  },
  email: {
    required: 'Email is required',
    validate: (email) => validateEmail(email) || 'Please enter a valid email address'
  },
  password: {
    required: 'Password is required',
    validate: (password) => validatePassword(password) || 'Password must be at least 6 characters long',
    minLength: 6
  },
  confirmPassword: {
    required: 'Please confirm your password',
    match: 'password',
    matchMessage: 'Passwords do not match'
  },
  dateOfBirth: {
    validate: (date) => validateDateOfBirth(date) || 'Please enter a valid date of birth (must be at least 13 years old)'
  },
  height: {
    validate: (height) => !height || validateHeight(height) || 'Height must be between 100cm and 250cm'
  },
  weight: {
    validate: (weight) => !weight || validateWeight(weight) || 'Weight must be between 30kg and 300kg'
  }
};

// Login form validation rules
export const loginRules = {
  email: {
    required: 'Email is required',
    validate: (email) => validateEmail(email) || 'Please enter a valid email address'
  },
  password: {
    required: 'Password is required'
  }
};

// Forgot password validation rules
export const forgotPasswordRules = {
  email: {
    required: 'Email is required',
    validate: (email) => validateEmail(email) || 'Please enter a valid email address'
  },
  uniqueId: {
    required: 'Unique ID is required',
    validate: (uniqueId) => validateUniqueId(uniqueId) || 'Please enter a valid Unique ID'
  }
};