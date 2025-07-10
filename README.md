# VIBLY

<!-- PROJECT LOGO OR HERO IMAGE PLACEHOLDER -->
<!-- ![VIBLY Logo](./path/to/logo.png) -->

## Connect with People Worldwide

VIBLY is a modern social platform that helps people connect with others worldwide. It features real-time chat, video calls, friend management, and a beautiful, responsive UI.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Folder Structure](#folder-structure)
- [Main Features](#main-features)
- [API Overview](#api-overview)
- [Screenshots](#screenshots)
- [Contributing](#contributing)

---

## Features
- **User Authentication**: Secure login and signup with JWT
- **Friend System**: Send and accept friend requests
- **Real-time Chat**: Instant messaging with Stream Chat integration
- **Video Calls**: Face-to-face conversations with Stream Video
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Theme Support**: Multiple beautiful themes with DaisyUI

---

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, DaisyUI, Zustand, React Query
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Real-time**: Stream Chat & Video APIs
- **Icons**: Lucide React

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)
- Stream API keys (for chat and video features)

### Backend Setup
```bash
cd backend
npm install
# Create a .env file based on .env.example and set your environment variables
npm run dev
```

### Frontend Setup
```bash
cd frontend/mernpro
npm install
# Create a .env file based on .env.example and set your environment variables
npm run dev
```

---

## Folder Structure
```
VIBLY/
  backend/         # Express.js backend (API, models, controllers)
  frontend/mernpro/ # React frontend (Vite, Tailwind, DaisyUI)
```

---

## Main Features

### 1. User Authentication
- Signup, login, JWT-based sessions
- Onboarding with profile setup

### 2. Friend System
- Send, accept, and manage friend requests
- View friends list

### 3. Real-time Chat
- 1:1 messaging using Stream Chat
- Message history, typing indicators, etc.

### 4. Video Calls
- Start video calls with friends using Stream Video

### 5. Notifications
- Friend request and connection notifications

### 6. Theming & Responsive UI
- Multiple themes with DaisyUI
- Mobile and desktop support

---

## API Overview

- **/api/auth/**: Authentication (register, login, logout)
- **/api/users/**: User management, friend requests
- **/api/chat/**: Chat-related endpoints

Data models include `User` and `FriendRequest` (see backend/src/models/).

---

## Screenshots

<img width="1883" height="971" alt="image" src="https://github.com/user-attachments/assets/1e5ede6e-26d4-4db6-a909-8fc6a9959db1" />

<img width="1882" height="905" alt="image" src="https://github.com/user-attachments/assets/01e4b963-5e50-4f3f-84b0-19a4c16d12fb" />

<img width="1900" height="971" alt="image" src="https://github.com/user-attachments/assets/e6015088-9b5b-4d4a-97c3-b8ff344344e9" />


---

## Contributing

Contributions are welcome! Please open issues or pull requests for improvements or bug fixes.

---

## License

This project is licensed under the ISC License. 
