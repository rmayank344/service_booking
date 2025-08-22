# service_booking
# Booking Management System

This is a Node.js + Express + Sequelize (MySQL) backend project for managing bookings between Customers and Pros (Service Providers).
It supports booking slots, rating after booking completion, and includes Role-Based Access Control (RBAC) using API Keys + JWT authentication.


# 1. Features

User Authentication & RBAC

API key is sent from frontend for every request.

Each API key is mapped to a role (e.g., customer, pro, admin).

After login/signup, users receive a JWT token.

Both api_key and JWT token are validated in middleware before accessing protected routes.

# 2. Booking System

Customers can book available slots.

Slot is locked until Pro confirms or rejects.

Prevents double-booking using transactions & row-level locking.

# 3. Ratings

Customers can leave a rating & review for completed bookings.

Prevents multiple ratings for the same booking.

APIs to create, fetch all, and fetch by ID.

# 4. Error Handling & Logging

Centralized response handler (send_success_response & send_error_response).

Error middleware (handleCaughtError) for proper debugging.

Request logs for every API.

# Tech Stack

Node.js

Express.js

Sequelize ORM

MySQL / MariaDB

JWT Authentication

RBAC via API Key

# Project Structure
project/
│── config/
│   ├── database.js          # Sequelize connection
│   ├── response_handler.js  # Success & error response helper
│
│── middlewares/
│   ├── authMiddleware.js    # JWT + API Key validation
│
│── models/
│   ├── user.js
│   ├── proAvailability.js
│   ├── booking.js
│   ├── rating.js
│   ├── index.js
│
│── controllers/
│   ├── bookingController.js
│   ├── ratingController.js
│   ├── authController.js
│
│── routes/
│   ├── bookingRoutes.js
│   ├── ratingRoutes.js
│   ├── authRoutes.js
│
│── utils/
│   ├── handleCaughtError.js
│
│── app.js                   # Express app
│── .env                     # Environment variables
│── package.json
│── README.md


# Installation & Setup

# Clone Repository
git clone <repo_url>
cd project


# Install Dependencies
npm install


# Setup Environment
Create a global .env file:

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=booking_db
JWT_SECRET=your_jwt_secret


# Setup Database

Create MySQL database:

CREATE DATABASE booking_db;

Run Sequelize migrations & sync models:



# Run Server

# Development mode
npm run dev

# Production mode
npm start


# Test API
Base URL: http://localhost:3000/api
Use Postman/Insomnia to test.