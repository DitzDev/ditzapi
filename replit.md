# DitzAPI - Fast, Reliable API Downloader

## Overview
This project is a full-stack web application built with React (frontend) and Express.js (backend) using TypeScript. It's an API downloader service that provides a modern, responsive interface for users to access API downloading services.

## Architecture
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL (configured with Drizzle ORM)
- **Styling**: Tailwind CSS + Radix UI components
- **Build System**: Vite for frontend, esbuild for backend

## Project Structure
```
├── client/               # React frontend application
│   ├── src/
│   │   ├── components/   # React components (UI + examples)
│   │   ├── pages/        # Application pages
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utility libraries
├── server/               # Express.js backend
│   ├── index.ts          # Main server entry point
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Database interface and in-memory storage
│   └── vite.ts           # Vite development setup
├── shared/               # Shared types and schemas
└── dist/                 # Built application files
```

## Recent Changes (Sept 29, 2025)
- ✅ Successfully imported project from GitHub
- ✅ Fixed all TypeScript LSP errors
- ✅ Installed all dependencies (npm install)
- ✅ Configured development workflow on port 5000
- ✅ Verified Vite configuration with allowedHosts for Replit environment
- ✅ Set up deployment configuration for autoscale deployment
- ✅ Tested both development server and build process

## Development Setup
The project is configured for the Replit environment with:
- Development server running on port 5000 (required for Replit)
- Vite configured with `allowedHosts: true` for proper proxy handling
- Hot module replacement (HMR) enabled
- TypeScript compilation with proper node types

## Deployment Configuration
- **Type**: Autoscale (stateless web application)
- **Build**: `npm run build` (builds both frontend and backend)
- **Start**: `npm start` (production server)
- **Port**: 5000 (automatically configured)

## Database
The project uses a JSON-based database for development with plans for PostgreSQL integration. Currently includes:
- User management with Firebase authentication
- API key management with weekly regeneration limits  
- User tier system (Free 300 requests/week vs Premium unlimited)
- OTP verification for password reset
- Request tracking and limits

## Firebase Setup Guide

### Prerequisites
1. Go to [Firebase Console](https://console.firebase.google.com/) 
2. Create a new Firebase project or select existing one

### Step-by-Step Setup

#### 1. Create Firebase Web App
- In Firebase Console, click "Add app" and select Web platform (</>)
- Register your app with a nickname (e.g., "DitzAPI")
- Copy the Firebase config object

#### 2. Enable Authentication
- Go to "Authentication" → "Sign-in method"
- Enable the following providers:
  - **Email/Password**: Enable for traditional signup/login
  - **Google**: Enable and configure (requires OAuth consent screen)
  - **GitHub**: Enable and add GitHub OAuth app credentials

#### 3. Configure Authorized Domains
- In Authentication → Settings → Authorized domains
- Add your Replit dev URL: `your-repl-name.your-username.repl.co`
- After deployment, add your production domain

#### 4. Set Environment Variables
Add these secrets to your Replit environment:
```bash
# Frontend (Vite) variables
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here  
VITE_FIREBASE_APP_ID=your_app_id_here

# Backend (Firebase Admin) variables
FIREBASE_PROJECT_ID=your_project_id_here
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY=your_private_key_here

# Email service (nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password_here
```

#### 5. Generate Service Account Key
- Go to Project Settings → Service accounts
- Generate new private key (JSON file)
- Use the values for backend environment variables

### Authentication Features
- **Multi-provider login**: Google, GitHub, Email+Password
- **User management**: Profile settings, display names, usernames
- **API key system**: Auto-generated keys with weekly regeneration limit
- **Password reset**: OTP verification via email
- **Account tiers**: Free (300 requests/week) vs Premium (unlimited)
- **Email notifications**: Configurable update notifications

## User Preferences
- Clean, modern UI with dark/light theme support
- Professional developer-focused design
- Responsive layout with mobile support
- Multi-authentication provider support
- Comprehensive account management system