# Project & Task Management API

A production-ready RESTful API built with **Node.js, Express, ES Modules, MySQL (Sequelize), and MongoDB (Mongoose)** for managing users, projects, tasks, and analytics dashboards.

Developed for the **Choira Backend Developer Technical Assessment**.

---

## 📚 Documentation & Quick Links

Click any of the links below to view the dedicated documentation files:

- 🗄️ **[Database Setup Instructions](./backend/DATABASE_SETUP.md)**  
  *Detailed schema definitions, MySQL table setup, MongoDB Atlas configuration, and connection guides.*

- 📡 **[API Documentation](./backend/API_DOCUMENTATION.md)**  
  *Complete API reference with request parameters, curl commands, JSON bodies, and success/error responses.*

- 🧪 **[Postman Collection](./backend/postman_collection.json)**  
  *Ready-to-import Postman / Thunder Client collection with automated JWT token handling.*

- 📜 **[MySQL Schema Script](./backend/database/schema.sql)**  
  *Pure SQL schema creation script for users and projects tables.*

- 📁 **[Backend Source Code](./backend/)**  
  *Complete ES Modules application codebase organized into routes, controllers, services, models, and middleware.*

---

## 🚀 Key Features & Architecture

- **Authentication (MySQL)**: JWT-based authentication, bcryptjs password hashing, email validation, and profile management.
- **Project Management (MySQL)**: Full CRUD operations with user ownership isolation and project status support (`active`, `completed`, `archived`).
- **Task Management (MongoDB)**: Mongoose schemas with project validation, status tracking (`todo`, `in_progress`, `completed`), priority levels (`low`, `medium`, `high`).
- **Filtering & Pagination**: Multi-criteria query filtering (`status`, `priority`, `projectId`) with page and limit pagination.
- **Dashboard API**: Real-time cross-database aggregated metrics (Total, active, completed projects; total, pending, completed, high-priority tasks).
- **Security & Validation**: Centralized error middleware, express-validator sanitization, helmet security headers, and CORS.

---

## 🛠️ Quick Start Guide

### 1. Navigate into the Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Configure your `.env` file (see [`.env.example`](./backend/.env.example)):
```env
PORT=5000
NODE_ENV=development

JWT_SECRET=supersecretjwtkey_replace_in_production_123456
JWT_EXPIRES_IN=7d

MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=project_management_db

MONGO_URI=mongodb+srv://sushimsushi8699_db_user:e2W6p2ZwrvDlAKM3@projectmanagement.iio5bfx.mongodb.net/task_management_db?retryWrites=true&w=majority
```

### 4. Run the Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

- API Base URL: `http://localhost:5000/api`
- Health check: `http://localhost:5000/api/health`

---

## 📂 Repository Layout

```text
backend-music-project/
├── backend/
│   ├── config/               # MySQL & MongoDB connection modules
│   ├── database/             # schema.sql database script
│   ├── src/
│   │   ├── controllers/      # Express route controllers
│   │   ├── middleware/       # JWT auth, error handlers, validation
│   │   ├── models/           # MySQL (Sequelize) & Mongo (Mongoose) models
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic & database operations
│   │   ├── utils/            # Standardized API response helpers
│   │   └── validators/       # express-validator rules
│   ├── .env.example          # Environment variables template
│   ├── API_DOCUMENTATION.md  # Full API specifications
│   ├── DATABASE_SETUP.md     # Database setup & schema guide
│   ├── package.json          # Dependencies and scripts
│   ├── postman_collection.json # Testing collection
│   ├── README.md             # Backend detailed README
│   └── server.js             # Application entrypoint
└── README.md                 # Root README with clickable links
```
