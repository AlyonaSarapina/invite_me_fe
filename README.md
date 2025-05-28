# Invite Me – Restaurant Table Booking System

**Invite Me** is a full-stack web application that allows users to book tables at restaurants and manage their reservations, while enabling restaurant owners to manage their listings, tables, and available booking slots. Designed with clean UI/UX, scalability, and modular architecture, the project serves both guests and restaurant owners efficiently.

---

## 🌟 Key Features

### ✅ Client Features

- 🔐 Authentication (Register, Login)
- 📖 Browse and view restaurant details
- 🗓️ Book a table by selecting date, number of people, and available time
- 🧾 View and cancel personal bookings
- 🔍 Filter and sort restaurants by name, rating, cuisine, and pet-friendliness

### ✅ Owner Features

- 🔐 Register/Login as an owner
- 🏪 Add and manage multiple restaurants
- 🪑 Configure number of tables per restaurant
- 🖼 Upload logo and menu (PDF) using Cloudinary
- ⏰ Add manual booking time slots
- 📋 View all bookings per restaurant

---

## 🛠 Tech Stack

### Backend

- **NestJS** (TypeScript)
- **PostgreSQL** with **TypeORM**
- **JWT Authentication**
- **Multer + Cloudinary** (file uploads)
- **Class-validator** for validation
- **Jest** for unit and e2e testing

### Frontend

- **Next.js** (TypeScript)
- **MobX State Tree** for state management
- **Bootstrap** + **React-Bootstrap**
- **Axios** for HTTP requests

---

## 🧩 Architecture Overview

- DTO-based type-safe APIs
- Separate models for login and registration
- RESTful API following layered service-repository-controller structure
- Fully responsive frontend with separate views for clients and owners

---

## 📁 Project Structure

```
invite-me/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── dto/
│   │   ├── decorators/
│   │   ├── enums/
│   │   ├── guards/
│   │   ├── interfaces/
│   │   ├── modules/
│   │   ├── seeds/
│   │   ├── services/
│   │   ├── tests/
│   │   ├── utils/
│   │   └── main.ts
├── frontend/
│   ├── app/
│   │   ├── user/
│   │   ├── register/
│   │   └── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   ├── validation/
│   ├── types/
│   ├── stores/
│   └── styles/
```

---

## 🚀 Getting Started

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run database migrations and seeders
npm run migration:run
npm run seed

# Start the server
npm run start:dev
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the frontend
npm run dev
```

---

## 🧪 Testing

```bash
# Unit Tests
npm run test

# End-to-End Tests
npm run test:e2e
```

---

## 🔐 Environment Variables (`.env.example`)

```env
DATABASE_URL=postgres://user:password@localhost:5432/invite_me
JWT_EXPIRES_IN=your_jwt_secret_expiration_time
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=3000 or any other
```

---

## 📌 To-Do / Future Improvements

- Admin dashboard for system monitoring
- Email confirmations for bookings
- Booking reminders (via email or SMS)
- Integration with calendar apps
- User reviews and ratings

---

## 👨‍💻 Author

Developed by Alyona Sarapina.
