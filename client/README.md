# 🌿 DAILYMOOD - MindScape Wellness

*A comprehensive web-based mental wellness monitoring system integrating mood, nutrition, and activity tracking.*


## 📌 Project Overview

**DAILYMOOD (MindScape Wellness)** is a full-stack web application designed to help individuals monitor and improve their mental well-being through integrated tracking of mood, nutrition, and physical activity. Built with modern web technologies, the platform provides real-time insights, data visualization, and personalized recommendations to promote holistic health management.


## ✨ Key Features

|           Feature              |                                 Description                                       |
| 😊 **Mood Tracking**          | Real-time emotional assessment using EMA methodology (1-10 scale)                 |
| 🍽️ **Nutrition Tracking**     | Food logging with calorie & macronutrient breakdown (Indian food database)        |
| 🏃 **Activity Monitoring**    | Exercise tracking with calorie burn calculation & intensity levels                |
| 📊 **Analytics Dashboard**    | Interactive charts for trends, progress metrics, and achievements                 |
| 🔐 **Secure Authentication**  | JWT-based login with unique ID + email password recovery                          |
| 🌓 **Theme Switching**        | Light/Dark mode for personalized user experience                                  |
| 📱 **Responsive Design**      | Works seamlessly on desktop, tablet, and mobile devices                           |


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

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/mindscape-wellness.git
cd mindscape-wellness

cd server
npm install
node server.js

cd client
npm install
npm run dev