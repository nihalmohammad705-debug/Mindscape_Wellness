# 🌿 DAILYMOOD - MindScape Wellness

[![Node.js Version](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue.svg)](https://mysql.com/)
[![JWT](https://img.shields.io/badge/JWT-Secure-orange.svg)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📖 Overview

**DAILYMOOD (MindScape Wellness)** is a comprehensive web-based mental wellness monitoring system that provides an interactive dashboard to track mood, nutrition, and physical activity across multiple wellness parameters.

> **⚠️ Important Note:** This is a **MENTAL WELLNESS MONITORING** application. Mood entries, nutrition logs, and activity tracking are user-reported and stored securely. It does not provide medical diagnosis unless integrated with clinical APIs.


## ✨ Key Features

|           Feature              |                                 Description                                       |
|--------------------------------|-----------------------------------------------------------------------------------|
| 😊 **Mood Tracking**          | Real-time emotional assessment using EMA methodology (1-10 scale)                 |
| 🍽️ **Nutrition Tracking**     | Food logging with calorie & macronutrient breakdown (Indian food database)        |
| 🏃 **Activity Monitoring**    | Exercise tracking with calorie burn calculation & intensity levels                |
| 📊 **Analytics Dashboard**    | Interactive charts for trends, progress metrics, and achievements                 |
| 🔐 **Secure Authentication**  | JWT-based login with unique ID + email password recovery                          |
| 🌓 **Theme Switching**        | Light/Dark mode for personalized user experience                                  |
| 📱 **Responsive Design**      | Works seamlessly on desktop, tablet, and mobile devices                           |

### Wellness Features
- 😊 **EMA Methodology** - Real-time mood recording with contextual factor tracking
- 🍛 **Indian Food Database** - Pre-loaded with Idly, Dosa, Biryani, and more
- 🏋️ **Activity Library** - Walking, Running, Yoga, Weight Training with MET calculations
- 📈 **Pattern Recognition** - Mood-nutrition-activity correlation analysis
- 🔥 **Streak Tracking** - Consistency rewards and achievement badges
- 🎯 **Personalized Insights** - AI-powered recommendations based on user patterns

### Security Features
- 🔒 **bcrypt Hashing** - Passwords securely hashed with 12 salt rounds
- 🎫 **JWT Tokens** - Stateless authentication with expiration
- 🆔 **Unique ID Recovery** - Two-factor password reset (Email + Unique ID)
- 🛡️ **SQL Injection Protection** - Parameterized queries throughout

## Technology Stack

### Frontend
- **React.js 18+** - UI Library
- **Vite** - Build Tool
- **Context API** - State Management
- **Chart.js** - Data Visualization
- **React Router** - Navigation
- **CSS3** - Styling with CSS Variables

### Backend
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **MySQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password Hashing

### Development Tools
- Git | VS Code | MySQL Workbench | Postman


---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version |                             Installation Guide                          |
|-------------|---------|-------------------------------------------------------------------------|
| Node.js     | 18+     | [https://nodejs.org/](https://nodejs.org/)                              |
| MySQL       | 8.0+    | [https://dev.mysql.com/downloads/](https://dev.mysql.com/downloads/)    |
| npm         | 9+      | Included with Node.js                                                   |
| Git         | Latest  | [https://git-scm.com/](https://git-scm.com/)                            |

### Installation Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/nihalmohammad705-debug/Mindscape_Wellness.git
cd Mindscape_Wellness

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/mindscape-wellness.git
cd Mindscape-Wellness


## Create a .env file in the server directory:
# Database Configuration (Required)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=mindscape_wellness
DB_PORT=3306

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Authentication (Required - Change this!)
JWT_SECRET=your_super_secure_jwt_secret_key_here_change_this

# Client URL
CLIENT_URL=http://localhost:3000


## Setup Database
# Login to MySQL
mysql -u root -p

# Run these commands in MySQL
CREATE DATABASE mindscape_wellness;
USE mindscape_wellness;
SOURCE database/schema.sql;
EXIT;

## Run Backend:
cd server
npm install
node server.js

## Run Frontend:
cd client
npm install
npm run dev
```

## 📖 How to Use
```text
Dashboard Controls

Control	Action
Check In	Record your current mood with contextual factors
Nourish	Log meals and track nutrition
Move	Record physical activities and exercise
Reflect	View analytics and wellness insights
Theme Toggle	Switch between Light/Dark mode
Profile	View your unique wellness ID and settings

What You See
Section	Description
Welcome Section	Personalized greeting with wellness ID
Wellness Toolkit	Quick access to all tracking features
Daily Challenges	Wellness tips and activity suggestions
Mindful Moments	Quick relaxation activities
Analytics Charts	Mood trends, nutrition stats, activity progress

Mood Color Coding
Mood Level	Score Range	Color	Icon
Excellent	9-10	🟢 Green	😄
Good	7-8	🔵 Blue	😊
Average	5-6	🟡 Yellow	😐
Needs Attention	3-4	🟠 Orange	😔
Critical	1-2	🔴 Red	😢

Meal Types
Meal Type	Icon	Description
Breakfast	🍳	Morning meals (6 AM - 11 AM)
Lunch	🍲	Midday meals (12 PM - 3 PM)
Dinner	🍽️	Evening meals (7 PM - 10 PM)
Snacks	🍎	Between-meal consumption
Other	🥤	Beverages and miscellaneous
Activity Intensity Levels
Intensity	Multiplier	Examples
Light	0.7x	Walking, Housework, Stretching
Moderate	1.0x	Brisk walking, Cycling, Yoga
Vigorous	1.5x	Running, Weight Training, HIIT
```

## 📁 Project Structure
```text
Mindscape_Wellness/
├── server.js                 # Main Express server
├── package.json             # Dependencies
├── .env                     # Environment variables
├── server/
│   ├── routes/
│   │   ├── authRoutes.js    # Authentication endpoints
│   │   ├── moodRoutes.js    # Mood tracking endpoints
│   │   ├── nutritionRoutes.js # Nutrition endpoints
│   │   ├── activityRoutes.js  # Activity endpoints
│   │   └── analyticsRoutes.js # Analytics endpoints
│   ├── controllers/         # Business logic
│   ├── models/              # Database models
│   ├── middleware/          # JWT auth & validation
│   └── config/
│       └── database.js      # MySQL connection
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── MoodTracker.jsx
│   │   │   ├── NutritionTracker.jsx
│   │   │   ├── ActivityTracker.jsx
│   │   │   └── Analytics.jsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── components/
│   │   ├── utils/
│   │   └── styles/
│   ├── public/
│   └── package.json
├── database/
│   └── schema.sql           # Database schema
└── README.md
```

## 🔑 API Endpoints
```text
Method	Endpoint	Description
POST	/api/auth/register	User registration
POST	/api/auth/login	User login
POST	/api/auth/forgot-password	Password recovery
POST	/api/mood	Add mood entry
GET	/api/mood/:userId	Get user mood entries
POST	/api/nutrition	Add food entry
GET	/api/nutrition/:userId	Get user nutrition entries
POST	/api/activity	Add activity log
GET	/api/activity/:userId	Get user activity logs
GET	/api/analytics/:userId	Get analytics data
```

## Troubleshooting
```text
Issue	Solution
MySQL connection error	Run net start MySQL80 (Windows) or sudo systemctl start mysql (Linux/Mac)
Port 5000 already in use	Change PORT in server/.env file
Port 3000 already in use	Change VITE_API_URL or kill process using the port
JWT token expired	Login again to get new token
Module not found	Run npm install in both client and server directories
Database tables missing	Run SOURCE database/schema.sql in MySQL\
```

📝 License
This project is submitted in partial fulfillment of the requirements for the Bachelor of Engineering degree in Computer Science and Engineering at Visvesvaraya Technological University, Belagavi.

🙏 Acknowledgments
Visvesvaraya Technological University, Belagavi

S.E.A College of Engineering and Technology, Bengaluru

All faculty members of the Computer Science & Engineering Department

React.js, Node.js, and MySQL communities
