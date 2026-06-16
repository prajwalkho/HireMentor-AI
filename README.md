# HireMentor-AI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18+-blue)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)](https://www.mongodb.com/)

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 🎯 Project Overview

**HireMentor-AI** is a comprehensive platform that bridges the gap between job seekers and employers by leveraging AI-powered features. It provides candidates with interview preparation, skill assessment, resume building, and personalized mentorship through AI-driven insights. Recruiters can conduct mock interviews, assess candidates, and manage the hiring process efficiently.

## ✨ Features

### For Candidates
- 🔐 **Secure Authentication** - Email verification with OTP and password reset functionality
- 📚 **Course Management** - Access to curated courses with structured learning paths
- 🎓 **Exam System** - Practice exams with detailed performance analytics
- 🤖 **AI Chat Assistant** - Gemini-powered chatbox for instant help and guidance
- 💼 **Resume Builder** - Professional resume creation tool with templates
- 🏆 **Certificates** - Earn and display certificates upon course completion
- 👤 **Profile Management** - Edit and manage candidate information
- 📊 **Dashboard** - Personalized dashboard with progress tracking
- 🎤 **Mock Interviews** - Practice interviews with AI feedback
- ⭐ **Skill Assessment** - Identify and showcase technical skills

### For Recruiters
- 📋 **Candidate Management** - View and manage candidate profiles
- 🎯 **Interview Scheduling** - Organize and conduct interviews
- 📊 **Candidate Assessment** - Evaluate candidates with detailed reports
- 🔍 **Search & Filter** - Advanced search capabilities for finding ideal candidates

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Router** - Client-side routing

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Cloudinary** - Image/file storage
- **Google Gemini API** - AI integration

### Tools & Services
- **Postman** - API testing
- **Git** - Version control
- **Vercel** - Deployment platform

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **MongoDB** (v5 or higher)
- **Git**

### Required API Keys
- Google Gemini API key
- Cloudinary credentials
- Email service credentials (for SMTP)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/prajwalkho/HireMentor-AI.git
cd HireMentor-AI
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file with required variables
# See Configuration section below
```

### 3. Frontend Setup

```bash
# Navigate to client directory (from project root)
cd client

# Install dependencies
npm install

# Create .env file with API endpoints
VITE_API_URL=http://localhost:5000/api
```

## 📖 Usage

### Running the Backend Server

```bash
cd server

# Start development server
npm start

# Server runs on http://localhost:5000
```

### Running the Frontend Application

```bash
cd client

# Start development server
npm run dev

# Application runs on http://localhost:5173
```

### Build for Production

```bash
# Backend
cd server
npm run build

# Frontend
cd client
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
HireMentor-AI/
├── client/                      # React frontend application
│   ├── src/
│   │   ├── api/                # API integration
│   │   ├── auth/               # Authentication components
│   │   ├── component/          # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── utils/              # Utility functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/                 # Static assets
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                      # Node.js backend
│   ├── src/
│   │   ├── config/             # Database and service configs
│   │   ├── controller/         # Route controllers
│   │   ├── middleware/         # Custom middleware
│   │   ├── models/             # MongoDB schemas
│   │   ├── routes/             # API routes
│   │   ├── utils/              # Helper functions
│   │   └── uploads/            # File uploads directory
│   ├── public/
│   ├── package.json
│   ├── server.js
│   └── seed.js
│
└── README.md
```

## 🔌 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Course Endpoints
- `GET /api/courses` - Fetch all courses
- `POST /api/courses` - Create course (Admin)
- `GET /api/courses/:id` - Get course details
- `PUT /api/courses/:id` - Update course (Admin)
- `DELETE /api/courses/:id` - Delete course (Admin)

### Exam Endpoints
- `GET /api/exams` - Fetch all exams
- `POST /api/exams` - Create exam
- `GET /api/exams/:id` - Get exam details
- `POST /api/exams/:id/submit` - Submit exam answers

### Interview Endpoints
- `GET /api/interviews` - Fetch interviews
- `POST /api/interviews` - Schedule interview
- `POST /api/interviews/:id/feedback` - Submit interview feedback

### AI Integration
- `POST /api/ai/chat` - Send message to AI chatbot
- `POST /api/ai/analyze` - Get AI analysis

For detailed API documentation, refer to the Postman collection or API documentation file.

## ⚙️ Configuration

Create a `.env` file in the server directory:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hireAI

# JWT
JWT_SECRET=your_jwt_secret_key
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Service (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Frontend URL
CLIENT_URL=http://localhost:5173

# Server Port
PORT=5000
NODE_ENV=development
```

Create a `.env.local` file in the client directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository**
   ```bash
   git clone https://github.com/prajwalkho/HireMentor-AI.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow the existing code style
   - Write meaningful commit messages
   - Test your changes thoroughly

4. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```

5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Describe your changes
   - Link any related issues
   - Wait for review and approval

### Code Style Guidelines
- Use ES6+ features
- Follow consistent naming conventions
- Write self-documenting code
- Add comments for complex logic
- Keep components small and focused

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

## 👥 Contact & Support

### Author
- **Name:** Prajwal Khot
- **Email:** [prajwalkhot39@gmail.com]
- **GitHub:** [@prajwalkho](https://github.com/prajwalkho)
- **LinkedIn:** [www.linkedin.com/in/prajwal-p-khot]

### Support
For support, email prajwalkhot39@gmail.com.com or open an issue on GitHub.

### Report a Bug
Found a bug? Please open an issue with:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details

---

**Made with ❤️ by Prajwal Khot**

> If you found this project helpful, please consider giving it a ⭐!
