# Expense Tracker — Backend

## Overview

This is the backend service for the Expense Tracker application. It handles user authentication, expense management, and data persistence using a local MySQL database.

## Tech Stack

- **Runtime** — Node.js
- **Framework** — Express.js
- **Database** — MySQL
- **Authentication** — JWT (jsonwebtoken)
- **Password Hashing** — bcryptjs
- **Dev Server** — nodemon

## Getting Started

### Prerequisites

- Node.js v18+
- MySQL 8+

### Installation

```bash
git clone https://github.com/yourusername/expense-tracker-backend.git
cd expense-tracker-backend
npm install
```

### Environment Variables

Create a `.env` file in the root:

```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=expense_tracker
JWT_SECRET=your_secret_key
PORT=8000
```

### Database Setup

Open MySQL and run:

```bash
CREATE DATABASE expense_tracker;
USE expense_tracker;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category ENUM('Food','Transport','Shopping','Health','Entertainment','Utilities','Housing','Other') NOT NULL,
  date DATE NOT NULL,
  note VARCHAR(500) NULL,
  is_deleted TINYINT(1) DEFAULT 0 NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Run

```bash
npm run dev    # development with hot reload
npm start      # production
```

Server runs at `http://localhost:8000`

## Project Structure

```bash
backend/
├── server.js              # Entry point
├── db.js                  # MySQL connection pool
├── .env                   # Environment variables
├── routes/                # URL definitions
│   ├── auth.js
│   └── expenses.js
├── controllers/           # Request / response handling
│   ├── authController.js
│   └── expenseController.js
├── services/              # Business logic + DB queries
│   ├── authService.js
│   └── expenseService.js
└── middleware/
    └── auth.js            # JWT verification
```

## Architecture

```bash
Request → Route → Middleware (JWT) → Controller → Service → MySQL
```

| Layer | Responsibility |
|---|---|
| Routes | URL path definitions only |
| Middleware | JWT token verification |
| Controllers | Parse request, send response |
| Services | Business logic, validation, DB queries |


## Security

- Passwords hashed with bcryptjs (10 salt rounds)
- JWT tokens expire in 7 days
- Row-level security — users can only access their own data
- Soft delete — records are never permanently removed
- Input validation before every DB operation


## Features

- User registration and login
- JWT-based authentication
- Add, edit, soft delete expenses
- Filter expenses by date range and category
- Pagination support
- Consistent `{ message, data }` response format across all endpoints


## Scripts

```bash
npm run dev    # Start with nodemon
npm start      # Start without nodemon
```

