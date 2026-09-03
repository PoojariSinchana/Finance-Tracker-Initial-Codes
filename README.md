# 💰 AI-Powered Finance Tracker

A full-stack personal finance management application built with the **MERN stack** that helps users track income and expenses, manage budgets, understand spending patterns, receive AI-powered financial insights, predict future spending, and generate monthly PDF reports.

## 🚀 Features

* 🔐 **User Authentication**

  * User signup and login
  * JWT-based authentication
  * Password hashing with bcrypt
  * Protected API routes
  * Profile and password management

* 💳 **Transaction Management**

  * Add income and expenses
  * Edit and delete transactions
  * Categorize transactions
  * Payment method tracking
  * Search and filter transactions
  * Sorting by date and amount
  * Pagination support

* 📊 **Financial Dashboard**

  * Total income
  * Total expenses
  * Savings
  * Remaining budget
  * Monthly spending trends
  * Category-wise spending breakdown
  * Income vs expense charts
  * Recent transactions

* 🎯 **Budget Management**

  * Set monthly budgets
  * Create category-wise spending limits
  * Track budget usage
  * View spending progress
  * Overspending alerts

* 🤖 **AI-Powered Insights**

  * Personalized financial insights
  * Spending recommendations
  * Uses OpenAI `gpt-4o-mini` when configured
  * Includes a deterministic heuristic fallback when OpenAI is unavailable

* 🔮 **Spending Prediction**

  * Predicts future expenses using historical spending
  * Provides a confidence score
  * Identifies potential budget risks

* 📄 **Monthly Reports**

  * Select a specific year and month
  * View monthly financial summaries
  * Category-wise report
  * Export reports as PDF

## 🛠️ Tech Stack

### Frontend

* React 18
* Vite
* React Router
* Redux Toolkit
* Axios
* Recharts
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* OpenAI SDK
* PDFKit
* Helmet
* CORS
* Express Rate Limit
* dotenv

The project uses React, Redux and Recharts on the client and Node.js, Express and MongoDB on the server.

## 📁 Project Structure

```text
AI-Based-Finance-Tracker/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── utils/
│   │   └── App.jsx
│   └── package.json
│
├── server/
│   ├── config/
│   ├── models/
│   │   ├── User.js
│   │   ├── Transaction.js
│   │   └── Budget.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── transactionController.js
│   │   ├── budgetController.js
│   │   ├── aiController.js
│   │   ├── dashboardController.js
│   │   └── reportController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   ├── services/
│   │   ├── aiService.js
│   │   └── financeAnalyzer.js
│   ├── app.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

## ⚙️ Prerequisites

Before running the project, install:

* Node.js v18+
* Git
* VS Code
* MongoDB Atlas or local MongoDB

MongoDB Atlas can be used with the free M0 tier. An OpenAI API key is optional because the application includes a heuristic fallback.

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd AI-Based-Finance-Tracker
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

## 🔐 Environment Variables

Create a `.env` file inside the `server` directory:

```env
PORT=5000

MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ai-finance-tracker?retryWrites=true&w=majority

JWT_SECRET=your_long_random_secret
JWT_EXPIRE=7d

OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini

FRONTEND_URL=http://localhost:5173
```

> **Important:** Never commit your `.env` file to GitHub.

The project configuration uses MongoDB, JWT authentication, an optional OpenAI key, and the Vite frontend URL.

## ▶️ Running the Application

### Start Backend

```bash
cd server
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### Start Frontend

Open another terminal:

```bash
cd client
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

## 🔗 API Endpoints

| Method | Endpoint                 | Description                 |
| ------ | ------------------------ | --------------------------- |
| POST   | `/api/auth/signup`       | Create a new user           |
| POST   | `/api/auth/login`        | Login                       |
| GET    | `/api/auth/me`           | Get current user            |
| PUT    | `/api/auth/profile`      | Update profile              |
| PUT    | `/api/auth/password`     | Change password             |
| GET    | `/api/auth/stats`        | Account statistics          |
| POST   | `/api/transactions`      | Create transaction          |
| GET    | `/api/transactions`      | Get transactions            |
| PUT    | `/api/transactions/:id`  | Update transaction          |
| DELETE | `/api/transactions/:id`  | Delete transaction          |
| POST   | `/api/budget`            | Create/update budget        |
| GET    | `/api/budget`            | Get budget                  |
| PUT    | `/api/budget`            | Update budget               |
| POST   | `/api/ai/insights`       | Generate financial insights |
| POST   | `/api/ai/predict`        | Predict spending            |
| GET    | `/api/dashboard/summary` | Dashboard analytics         |
| GET    | `/api/reports/monthly`   | Monthly report              |
| GET    | `/health`                | Server health check         |

The protected endpoints require a JWT Bearer token.

## 🤖 AI Insight System

The application uses two layers for financial analysis:

### 1. Finance Analyzer

`financeAnalyzer.js` calculates:

* Income
* Expenses
* Savings
* Category breakdown
* Monthly trends
* Predicted expenses
* Rule-based recommendations

### 2. AI Service

`aiService.js` sends summarized financial information to OpenAI when an API key is available.

If OpenAI is unavailable, the application automatically uses the built-in heuristic engine, so financial insights remain available without an external AI service.

## 🔒 Security

The application includes:

* JWT authentication
* bcrypt password hashing
* User-specific data isolation
* Protected API routes
* Helmet security headers
* CORS origin restrictions
* Rate limiting
* Environment variables for secrets
* MongoDB validation and indexes

Every transaction and budget query is scoped to the authenticated user's ID.

## 📈 Dashboard Analytics

The dashboard provides:

* Income vs expense analysis
* Monthly spending trend
* Category distribution
* Savings information
* Budget status
* Recent transactions

Charts are implemented using **Recharts**.

## 📄 PDF Reports

Users can generate monthly financial reports containing:

* Financial summary
* Category-wise expenses
* Transactions
* Monthly analysis

PDF reports are generated on the backend using **PDFKit** and streamed directly to the client.

Example filename:

```text
finance-report-2026-09.pdf
```

## 🎯 Project Goals

This project aims to solve common personal finance problems such as:

* Lack of spending visibility
* Undetected overspending
* Manual budgeting
* Lack of personalized financial advice
* Difficult-to-understand bank statements
* Lack of spending predictions

The application converts raw financial transactions into structured analytics, insights, predictions, and reports.

## 🔮 Future Improvements

Possible future enhancements:

* Bank account integration
* Automatic transaction import
* Expense receipt scanning
* Advanced AI financial assistant
* Email notifications
* Budget reminders
* Investment tracking
* Recurring transactions
* Mobile application
* Advanced forecasting models

## 👨‍💻 Author

**Sinchan Poojary**

---

⭐ If you find this project useful, consider giving the repository a star!
