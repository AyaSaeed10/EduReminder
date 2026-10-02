# EduReminder

EduReminder is a full-stack web application designed to help private teachers manage their students, lessons, schedules, and reminders in one organized system.

The application allows teachers to manage student information, schedule lessons through an interactive calendar, receive notifications about upcoming lessons, and automatically send reminders before scheduled lessons.

The goal of EduReminder is to simplify lesson management and reduce the chance of missed or forgotten lessons.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Main Features](#main-features)
- [How the System Works](#how-the-system-works)
- [Technologies Used](#technologies-used)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [Student Management](#student-management)
- [Lesson Management](#lesson-management)
- [Calendar](#calendar)
- [Reminder System](#reminder-system)
- [Notifications](#notifications)
- [Database](#database)
- [API Structure](#api-structure)
- [Security](#security)
- [Environment Variables](#environment-variables)
- [Installation and Local Setup](#installation-and-local-setup)
- [Deployment](#deployment)
- [Future Improvements](#future-improvements)
- [Author](#author)

---

# Project Overview

Private teachers often need to manage multiple students, lesson times, contact information, and upcoming appointments.

Managing this information manually can become difficult, especially when lessons are scheduled on different days and times.

EduReminder provides a centralized platform where teachers can:

- Manage their students
- Schedule and organize lessons
- View lessons through a calendar
- Update or cancel lessons
- Receive notifications about upcoming lessons
- Automatically manage lesson reminders
- Manage their account and application settings

The system combines scheduling, student management, and reminders into one web application.

---

# Main Features

## Teacher Authentication

EduReminder provides an authentication system that allows teachers to securely access their accounts.

The authentication system includes:

- Teacher registration
- Teacher login
- Authentication verification
- Persistent login using cookies
- Protected application routes
- Secure logout

Only authenticated teachers can access the main application pages.

---

## Dashboard

After logging in, the teacher is directed to the main application dashboard.

The dashboard acts as the central entry point to the system and provides access to the main EduReminder functionality.

From the application, teachers can navigate between:

- Dashboard
- Calendar
- Students
- Lessons
- Notifications
- Settings

---

# Student Management

Teachers can manage the students associated with their account.

The student management functionality allows teachers to:

- Add new students
- View existing students
- Store student information
- Edit student information
- Delete students
- Use student information when scheduling lessons

Each student belongs to the authenticated teacher, ensuring that teachers only access their own student data.

---

# Lesson Management

EduReminder allows teachers to create and manage lessons for their students.

A lesson can contain information such as:

- Student
- Date
- Time
- Lesson topic or description
- Lesson status
- Reminder status

Teachers can:

- Create lessons
- View scheduled lessons
- Edit existing lessons
- Delete or cancel lessons
- Connect each lesson to a specific student

Lesson information is stored in the database and displayed throughout the application.

---

# Calendar

The calendar provides a visual way to manage scheduled lessons.

Teachers can use the calendar to view their lesson schedule and organize upcoming lessons.

When scheduling a lesson, the teacher can select information such as:

- Student
- Date
- Time
- Lesson topic

Lessons are displayed according to their scheduled date.

The calendar makes it easier to understand the teacher's schedule and quickly identify upcoming lessons.

---

# Reminder System

One of the main features of EduReminder is its automatic reminder system.

The system checks scheduled lessons and determines when a reminder should be sent.

For upcoming lessons, the reminder mechanism can process lessons approximately 24 hours before their scheduled time.

After a reminder is successfully processed, the lesson is marked so that the same reminder is not sent repeatedly.

For example, a lesson can contain a field such as:

```text
reminderSent: true
```

This helps prevent duplicate reminders.

The general reminder process is:

```text
Scheduled Lesson
      ↓
Check Lesson Date and Time
      ↓
Is the Lesson Approaching?
      ↓
Create / Send Reminder
      ↓
Create Notification
      ↓
Mark Reminder as Sent
```

---

# Notifications

EduReminder includes an in-app notification system.

Notifications can inform teachers about important events, especially upcoming lessons and reminder activity.

The teacher can access the notifications section from the application and review relevant updates.

This provides another way to keep track of scheduled lessons without constantly checking the calendar.

---

# How the System Works

The application follows a client-server architecture.

```text
Teacher
   ↓
React Frontend
   ↓
REST API
   ↓
Node.js + Express Backend
   ↓
MongoDB Database
```

The frontend is responsible for the user interface and user interactions.

The backend handles:

- Authentication
- Business logic
- Student management
- Lesson management
- Reminder processing
- Notifications
- Database communication

MongoDB stores the application's persistent data.

---

# Technologies Used

## Frontend

- React
- JavaScript
- Vite
- React Router
- Tailwind CSS
- Fetch API

## Backend

- Node.js
- Express.js
- REST API
- JWT authentication
- bcrypt
- Cookie-based authentication

## Database

- MongoDB
- Mongoose

## Deployment

- Vercel
- MongoDB Atlas

## Development Tools

- Git
- GitHub
- Visual Studio Code
- npm

---

# System Architecture

EduReminder uses a full-stack architecture with separate frontend and backend applications.

```text
┌─────────────────────────────┐
│          Teacher            │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       React Frontend        │
│                             │
│ Dashboard                   │
│ Calendar                    │
│ Students                    │
│ Lessons                     │
│ Notifications               │
│ Settings                    │
└──────────────┬──────────────┘
               │
               │ HTTP / REST API
               ▼
┌─────────────────────────────┐
│    Node.js / Express API    │
│                             │
│ Authentication              │
│ Student Management          │
│ Lesson Management           │
│ Reminder Logic              │
│ Notifications               │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│          MongoDB            │
│                             │
│ Teachers                    │
│ Students                    │
│ Lessons                     │
│ Notifications               │
└─────────────────────────────┘
```

---

# Project Structure

The project is divided into two main directories:

```text
EduReminder/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

### `client/`

Contains the React frontend of the application.

It is responsible for:

- User interface
- Navigation
- Forms
- Calendar display
- Student management interface
- Lesson management interface
- Notifications
- Settings
- Communication with the backend API

### `server/`

Contains the Node.js and Express backend.

It is responsible for:

- API endpoints
- Authentication
- Authorization
- Database operations
- Student operations
- Lesson operations
- Reminder logic
- Notification logic

---

# Authentication

EduReminder uses JWT-based authentication.

After a successful login, the server creates an authentication token.

The token is stored using an HTTP-only cookie rather than being directly accessible from frontend JavaScript.

Authenticated frontend requests include credentials when communicating with the backend.

Example:

```javascript
fetch(API_URL, {
  credentials: "include"
});
```

The backend verifies the authentication token before allowing access to protected resources.

The authentication flow is approximately:

```text
Teacher Login
     ↓
Verify Credentials
     ↓
Generate JWT
     ↓
Store JWT in HTTP-only Cookie
     ↓
Authenticated Requests
     ↓
Protected Backend Routes
```

---

# Database

EduReminder uses MongoDB as its database and Mongoose for data modeling.

The database stores the information required by the application, including teacher accounts and application data.

Main data entities include:

### Teacher

Stores teacher account information used for authentication and application ownership.

### Student

Stores information about students managed by a teacher.

### Lesson

Stores scheduled lesson information, including the associated student, date, time, and reminder status.

### Notification

Stores notifications generated by the system.

Relationships between the main entities can be represented as:

```text
Teacher
   │
   ├── Students
   │
   ├── Lessons
   │      │
   │      └── Student
   │
   └── Notifications
```

---

# API Structure

The frontend communicates with the backend using REST API requests.

The API is divided into logical route groups.

Examples include:

```text
/api/auth
/api/students
/api/lessons
/api/notifications
```

Typical HTTP operations include:

```text
GET     → Retrieve data
POST    → Create data
PUT     → Update data
DELETE  → Delete data
```

Authentication routes are responsible for operations such as:

```text
Register
Login
Check authenticated user
Logout
```

Student routes handle student management.

Lesson routes handle lesson creation and scheduling.

Notification routes handle teacher notifications.

---

# Security

Several security practices are used in EduReminder.

## Password Hashing

Teacher passwords are not stored as plain text.

Passwords are hashed before being stored in the database.

## JWT Authentication

JWT tokens are used to identify authenticated teachers.

## HTTP-only Cookies

Authentication tokens can be stored in HTTP-only cookies, helping prevent direct JavaScript access to authentication credentials.

## Protected Routes

Sensitive backend routes require authentication before returning or modifying data.

## Environment Variables

Sensitive configuration values are stored in environment variables instead of being hard-coded into the source code.

The `.env` file should never be committed to GitHub.

---

# Environment Variables

The backend requires environment variables for configuration.

Create a `.env` file inside the server directory.

Example:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email
EMAIL_APP_PASSWORD=your_email_app_password

CLIENT_URL=http://localhost:5173

NODE_ENV=development
```

For security reasons, never upload real environment variable values to GitHub.

The `.env` file should be included in `.gitignore`.

Example:

```gitignore
server/.env
node_modules/
```

When deploying the application, production environment variables should be configured directly through the deployment platform.

---

# Installation and Local Setup

## 1. Clone the Repository

```bash
git clone https://github.com/AyaSaeed10/EduReminder.git
```

Move into the project directory:

```bash
cd EduReminder
```

---

## 2. Install Frontend Dependencies

```bash
cd client
npm install
```

---

## 3. Install Backend Dependencies

Open another terminal:

```bash
cd server
npm install
```

---

## 4. Configure Environment Variables

Create:

```text
server/.env
```

Add the required environment variables.

Example:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_APP_PASSWORD=your_email_app_password
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

## 5. Start the Backend

From the `server` directory:

```bash
npm run dev
```

or, depending on the configured scripts:

```bash
npm start
```

---

## 6. Start the Frontend

From the `client` directory:

```bash
npm run dev
```

Vite will start the development server.

The application will normally be available at:

```text
http://localhost:5173
```

---

# Deployment

EduReminder is deployed using Vercel.

The frontend and backend are deployed separately.

## Frontend

```text
https://edureminder-client-smoky.vercel.app
```

## Backend

```text
https://edureminder-server.vercel.app
```

Production environment variables are configured through the deployment environment rather than being stored directly in the GitHub repository.

The GitHub repository contains the application source code under:

```text
client/
server/
```

while sensitive files such as:

```text
server/.env
```

are excluded from version control.

---

# Future Improvements

EduReminder can be extended with additional features in the future, such as:

- More advanced reminder configuration
- Custom reminder times
- Additional notification channels
- Improved dashboard statistics
- Lesson history and reporting
- Student attendance tracking
- Search and filtering options
- Recurring lessons
- Additional calendar functionality
- Enhanced mobile responsiveness
- Additional teacher preferences

---

# Project Goal

The main goal of EduReminder is to provide private teachers with a simple and organized system for managing students and lessons.

Instead of using multiple tools for scheduling, student information, and reminders, EduReminder combines these tasks into a single application.

The project demonstrates full-stack web development concepts including:

- Frontend development
- Backend development
- REST API design
- Database management
- User authentication
- Authorization
- Scheduling
- Automated reminders
- Application security
- Cloud deployment

---

# Author

**Aya Saeed**

Software Engineering Student

EduReminder was developed as a full-stack web application for managing private teaching schedules, students, lessons, and reminders.

---

## Repository

**EduReminder**

```text
https://github.com/AyaSaeed10/EduReminder
```

## Live Application

```text
https://edureminder-client-smoky.vercel.app
```
