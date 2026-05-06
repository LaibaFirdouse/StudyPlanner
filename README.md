# Study Planner 

A modern full-stack study planning application built with **Next.js 16**, designed to help users create structured learning plans, track progress in real time, and stay consistent with their goals.

Users can generate personalized study plans for skills, technologies, languages, and self-improvement topics, then monitor completion through an interactive dashboard with analytics and progress tracking.

---

## Features

### Authentication
- Google OAuth login using NextAuth
- User-specific dashboards and plans
- Secure API routes with session-based access

### Study Plan Management
- Create structured study plans
- Dynamic task generation using a rule-engine approach
- User-specific plan storage
- Prevent duplicate plans for the same goal

### Progress Tracking
- Real-time task completion updates
- Instant progress recalculation without page refresh
- Per-plan completion percentage
- Task status indicators

### Dashboard Analytics
- Total plans
- Average progress
- Completed plans
- Active plans tracking

### Plan Controls
- Delete plans instantly
- Secure ownership-based deletion
- Protected APIs preventing unauthorized access

### Modern UI/UX
- Responsive layout
- Clean dashboard experience
- Smooth transitions and hover interactions
- Empty states and loading states
- Product-style card design

---

# Tech Stack

## Frontend
- Next.js 16
- React
- TypeScript
- Tailwind CSS

## Backend
- Next.js API Routes
- MongoDB
- Mongoose

## Authentication
- NextAuth.js
- Google OAuth

## Deployment
- Vercel

---

---

# Key Engineering Decisions

### User-Isolated Architecture
Every plan is tied to the authenticated user to ensure:
- secure access
- isolated dashboards
- protected CRUD operations

---

### Rule-Based Plan Generation
Instead of hardcoded static tasks, the app uses a structured rule-engine approach for generating plans dynamically based on:
- goal
- level
- duration

This creates scalable foundations for future AI integration.

---

### Optimistic UI Updates
Task completion updates instantly on the frontend before waiting for full refetches, improving responsiveness and user experience.

---

# Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/LaibaFirdouse/StudyPlanner
cd StudyPlanner
```

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Setup environment variables

Create a `.env.local` file:

```env
MONGODB_URI=your_mongodb_uri

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```

---

## 4. Run development server

```bash
npm run dev
```

---

# Future Improvements

- AI-powered smart plan generation
- Personalized recommendations
- Streak system enhancements
- Resource recommendations
- Calendar integration
- Notifications and reminders
- Mobile-first optimization
- Plan editing support

---

# Deployment

The application is deployed on **Vercel** with MongoDB Atlas as the database backend.

---

# Screenshots

## Dashboard
![Dashboard](./public/screenshots/dashboard.png)

## Study Plan
![Study Plan](./public/screenshots/plans.png)
![Study Plan](./public/screenshots/plans1.png)


## Authentication
![Authentication](./public/screenshots/prompt.png)


---


# Author

### Laiba Firdouse

Frontend-focused full-stack developer passionate about building polished, user-centric products with modern web technologies.