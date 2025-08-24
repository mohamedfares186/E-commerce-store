## 📚 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Security Highlights](#-security-highlights)
- [Testing & Dev Tools](#-testing--dev-tools)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Run Development Server](#running-the-development-server)
- [Testing](#-testing)
- [Environment Variables](#-environment-variables)
- [Dependencies Reference](#-dependencies-reference)
- [License](#-license)

---

# 🛡️ E-Commerce Store (Node.js + Express + MongoDB)

a complete backend for an e-commerce website constructed using **MongoDB**, **Express**, and **Mongoose**. With the right middleware structure, role-based access control, CSRF protection, and unit/integration testing, this project is safe, scalable, and prepared for production.

---

## 🧰 Features

### 👥 Users & Guests

- View all **products** and **categories**
- Guests can browse freely
- Only **registered users** can:
  - Create and manage their **cart**
  - **Place orders**
  - **Track** their own order status
  - **Verify orders** via email (email confirmation required)

### 🛒 Cart & Checkout

- Each user has **one active cart**
- Can **add/remove items**
- **Checkout process** with:
  - Order verification
  - Email confirmation

### 🔐 Auth System

- Secure **user registration**, **login**, and **logout**
- Passwords hashed using `bcryptjs`
- JWT-based sessions with cookie storage

### 📊 Admin Dashboard (Admin / Moderator)

- View all **orders**, **carts**, and **statistics**
- Change **order statuses**
- Manage **users**:
  - Retrieve, update, delete users
  - Add new users manually
- Manage **products** and **categories**

---

## 🧰 Tech Stack

| Tool                   | Purpose                    |
| ---------------------- | -------------------------- |
| **Node.js**            | Runtime                    |
| **Express.js**         | Web framework              |
| **MongoDB + Mongoose** | Database and ORM           |
| **cookie-parser**      | Parse HTTP request cookies |
| **bcryptjs**           | Password hashing           |
| **jsonwebtoken**       | Auth tokens                |
| **Nodemailer**         | Email services             |
| **express-rate-limit** | Throttle requests          |
| **express-validator**  | Validate user input        |
| **helmet**             | Secure headers             |
| **sanitize-html**      | sanitize user input        |
| **nanoid**             | Generate unique IDs        |
| **vitest**             | Testing framework          |
| **Supertest**          | HTTP assertions            |
| **nodemailer-mock**    | Email mocking during tests |
| **ESLint**             | Code linting               |
| **Nodemon**            | Auto-restarting server     |
| **GitHub Actions**     | CI pipeline                |
| **GitHub Secrets**     | Secure env management      |

---

## 🛡️ Security Highlights

Security is a top priority in this project. Implemented protections include:

- **NoSQL Injection Mitigation:**  
  Custom middleware for sanitizing incoming queries and payloads to prevent injection attacks.

- **CSRF Protection:**  
  Custom token generator and validator using cookies and headers for secure CSRF token handling.

- **Authentication & Authorization:**  
  Modular middlewares for:
  - Token-based authentication
  - Role-based authorization (`admin`, `moderator`, `user`)
  - Fine-grained access control to resources

---

## ⚙️ Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- A Gmail account or SMTP credentials for sending email

---

## 📥 Installation

```bash
git clone https://github.com/your-username/ecommerce-backend.git
cd ecommerce-backend
npm install
cp .env.example .env
npm run dev
```

---

### Running the development server

```
npm run dev
```

---

### 🧪 Testing

```
npm test
```

---

## 🔑 Environment Variables

Create a `.env` file in the root with the following keys:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_token_secret
REFRESH_TOKEN_SECRET=you_token_secret
EMAIL_USER=your_email_address@gmail.com
EMAIL_PASS=your_email_password_or_app_password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
U2000=admin
U9550=moderator
U1234=user
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
```

---

## 📘 Dependencies Reference

All official docs for referenced libraries:

- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [cookie-parser](https://www.npmjs.com/package/cookie-parser)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [nodemailer](https://nodemailer.com/about/)
- [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)
- [express-validator](https://express-validator.github.io/docs/)
- [helmet](https://www.npmjs.com/package/helmet)
- [sanitize-html](https://www.npmjs.com/package/sanitize-html)
- [nanoid](https://www.npmjs.com/package/nanoid)
- [eslint](https://eslint.org/)
- [vitest](https://vitest.dev/)
- [supertest](https://www.npmjs.com/package/supertest)
- [nodemailer-mock](https://www.npmjs.com/package/nodemailer-mock)

---

## 📜 License

This project is licensed under the **MIT License**.  
See the full license in [LICENSE.txt](./LICENSE.txt).
