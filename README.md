# Project & Task Management API

A production-ready RESTful API built with **Node.js, Express, ES Modules, MySQL (Sequelize), and MongoDB (Mongoose)** for managing users, projects, tasks, and analytics dashboards.

---

## 🚀 Technologies Used

- **Runtime & Architecture**: Node.js (v18+ with ES Modules `import/export`, functional structure)
- **Framework**: Express.js (v5)
- **Relational Database**: MySQL (via Sequelize ORM) for **Users** and **Projects**
- **Document Database**: MongoDB (via Mongoose ODM) for **Tasks**
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs for secure password hashing
- **Input Validation**: `express-validator` with centralized response formatting
- **Security & Logging**: Helmet, CORS, Morgan

---

## 📁 Project Structure

```text
backend/
├── config/
│   ├── db.mysql.js            # MySQL Sequelize configuration & auto-sync
│   └── db.mongo.js            # MongoDB Mongoose connection
├── database/
│   └── schema.sql             # SQL schema for manual MySQL setup
├── src/
│   ├── app.js                 # Express application middleware setup
│   ├── controllers/
│   │   ├── auth.controller.js      # Register, Login, Me, Update Profile
│   │   ├── project.controller.js   # Project CRUD
│   │   ├── task.controller.js      # Task CRUD, filters, pagination
│   │   └── dashboard.controller.js # Multi-database stats aggregator
│   ├── middleware/
│   │   ├── auth.middleware.js      # JWT verification & req.user binding
│   │   ├── error.middleware.js     # Centralized error handler & 404 handler
│   │   └── validate.middleware.js  # express-validator result handler
│   ├── models/
│   │   ├── mongo/
│   │   │   └── Task.js             # Mongoose Task schema
│   │   └── mysql/
│   │       ├── User.js             # Sequelize User definition
│   │       ├── Project.js          # Sequelize Project definition
│   │       └── index.js            # Sequelize associations (1:N)
│   ├── routes/
│   │   ├── auth.routes.js          # /api/auth/*
│   │   ├── project.routes.js       # /api/projects/*
│   │   ├── task.routes.js          # /api/tasks/*
│   │   ├── dashboard.routes.js     # /api/dashboard
│   │   └── index.js                # Combined API router & health check
│   ├── services/
│   │   ├── auth.service.js         # Business logic: hashing, JWT, profiles
│   │   ├── project.service.js      # MySQL queries, ownership verification
│   │   ├── task.service.js         # Mongo queries, pagination, filtering
│   │   └── dashboard.service.js    # Aggregating MySQL & Mongo counts
│   ├── utils/
│   │   ├── apiResponse.js          # Standardized JSON response helper
│   │   └── apiError.js             # Functional operational error creator
│   └── validators/
│       ├── auth.validator.js       # Auth body validation rules
│       ├── project.validator.js    # Project body & param rules
│       └── task.validator.js       # Task body, param & query rules
├── .env.example               # Example environment variables
├── .gitignore                 # Git ignore for node_modules and .env
├── package.json               # Dependencies and npm scripts
├── postman_collection.json    # Complete ready-to-test Postman collection
├── README.md                  # Complete documentation
└── server.js                  # Application entry point
```

---

## 🛠️ Installation & Setup Instructions

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **MySQL**: MySQL Server 8.0+ or XAMPP / MariaDB running locally on port `3306`
- **MongoDB**: MongoDB Community Server running locally on port `27017` or MongoDB Atlas URI

### 2. Clone and Install Dependencies
```bash
cd backend
npm install
```

### 3. Environment Variable Configuration
Copy `.env.example` to create `.env`:
```bash
cp .env.example .env
```

Configure your credentials inside `.env`:
```env
# Application
PORT=5000
NODE_ENV=development

# JWT Authentication
JWT_SECRET=supersecretjwtkey_replace_in_production_123456
JWT_EXPIRES_IN=7d

# MySQL Database (Users & Projects)
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=project_management_db

# MongoDB Database (Tasks)
MONGO_URI=mongodb+srv://sushimsushi8699_db_user:e2W6p2ZwrvDlAKM3@projectmanagement.iio5bfx.mongodb.net/task_management_db?retryWrites=true&w=majority
```

### 4. Database Setup

#### MySQL:
Ensure the database `project_management_db` exists:
```sql
CREATE DATABASE IF NOT EXISTS `project_management_db`;
```
*Note: The Sequelize ORM will automatically create and sync all tables (`users` and `projects`) when the application starts. Alternatively, you can run the SQL script found in `database/schema.sql`.*

#### MongoDB:
The project is configured to connect directly to the deployed **MongoDB Atlas** cluster:
`mongodb+srv://sushimsushi8699_db_user:e2W6p2ZwrvDlAKM3@projectmanagement.iio5bfx.mongodb.net/`
*(Local MongoDB `mongodb://127.0.0.1:27017/task_management_db` is also supported as an alternative).*

### 5. Running the Application

- **Development mode (with auto-reload)**:
  ```bash
  npm run dev
  ```
- **Production start**:
  ```bash
  npm start
  ```

Once running:
- API Base URL: `http://localhost:5000/api`
- Health check: `http://localhost:5000/api/health`

---

## 📡 API Reference & Documentation

### Standard Response Format

#### Success:
```json
{
  "success": true,
  "message": "Operation successful description",
  "data": { ... }
}
```

#### Error:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

---

### 1. Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Login with email and password | No |
| `GET` | `/api/auth/me` | Get current authenticated user profile | Yes (`Bearer <token>`) |
| `PUT` | `/api/auth/profile` | Update profile (name, email, password) | Yes (`Bearer <token>`) |

#### Sample Register Request:
`POST /api/auth/register`
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123"
}
```

#### Sample Response:
```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "user": {
      "id": 1,
      "name": "Jane Doe",
      "email": "jane@example.com",
      "createdAt": "2026-10-26T14:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2. Project Management Endpoints (`/api/projects`)
*All project endpoints require `Authorization: Bearer <token>`.*

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/projects` | Create a new project for current user |
| `GET` | `/api/projects` | List all projects belonging to user |
| `GET` | `/api/projects/:id` | Get details of a project |
| `PUT` | `/api/projects/:id` | Update project details |
| `DELETE` | `/api/projects/:id` | Delete project and cascade-delete tasks |

#### Project Statuses:
- `active`
- `completed`
- `archived`

#### Sample Create Project Request:
`POST /api/projects`
```json
{
  "title": "Music Collaboration Platform",
  "description": "Backend API integration with MongoDB and MySQL",
  "status": "active"
}
```

---

### 3. Task Management Endpoints (`/api/tasks`)
*All task endpoints require `Authorization: Bearer <token>`.*

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/tasks` | Create task associated with a project & user |
| `GET` | `/api/tasks` | Get paginated & filtered list of tasks |
| `GET` | `/api/tasks/:id` | Get task by Mongo ID |
| `PUT` | `/api/tasks/:id` | Update task |
| `DELETE` | `/api/tasks/:id` | Delete task |

#### Task Fields:
- `title` (String, required)
- `description` (String, optional)
- `status`: `todo` | `in_progress` | `completed`
- `priority`: `low` | `medium` | `high`
- `projectId` (Integer, references MySQL project owned by user)
- `dueDate` (ISO8601 date, optional)

#### Pagination & Filtering:
```
GET /api/tasks?page=1&limit=10&status=todo&priority=high&projectId=1
```

#### Sample Tasks Response:
```json
{
  "success": true,
  "message": "Tasks retrieved successfully.",
  "data": {
    "tasks": [
      {
        "_id": "671ccab1e0123456789abcde",
        "title": "Build Authentication Module",
        "description": "Implement bcrypt password hashing & JWT",
        "status": "todo",
        "priority": "high",
        "projectId": 1,
        "userId": 1,
        "dueDate": "2026-11-01T00:00:00.000Z",
        "createdAt": "2026-10-26T14:15:00.000Z",
        "updatedAt": "2026-10-26T14:15:00.000Z"
      }
    ],
    "pagination": {
      "totalRecords": 25,
      "totalPages": 3,
      "currentPage": 1,
      "limit": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

### 4. Dashboard Statistics Endpoint (`/api/dashboard`)
*Requires `Authorization: Bearer <token>`.*

Retrieves aggregated real-time metrics across both databases for the authenticated user:

`GET /api/dashboard`

#### Sample Response:
```json
{
  "success": true,
  "message": "Dashboard statistics retrieved successfully.",
  "data": {
    "projects": {
      "total": 5,
      "active": 3,
      "completed": 2
    },
    "tasks": {
      "total": 14,
      "pending": 9,
      "completed": 5,
      "highPriority": 4
    },
    "summary": {
      "totalProjects": 5,
      "activeProjects": 3,
      "completedProjects": 2,
      "totalTasks": 14,
      "pendingTasks": 9,
      "completedTasks": 5,
      "highPriorityTasks": 4
    }
  }
}
```

---

## 🧪 Testing with Postman / Thunder Client

A pre-configured Postman collection is included in the project root:
- **`postman_collection.json`**

### Steps to Test:
1. Open Postman or Thunder Client in VS Code.
2. Click **Import** and select `postman_collection.json`.
3. The collection has automatic token extraction:
   - When you call **POST Register** or **POST Login**, the returned JWT token is automatically saved to the collection variable `authToken`.
   - Subsequent requests (Projects, Tasks, Dashboard) automatically use `Bearer {{authToken}}`.

---

## 🛡️ Validation & Error Handling Architecture

- **Duplicate Email Detection**: Handled both via pre-emptive service lookup and Sequelize database unique constraints (HTTP 409 Conflict).
- **Ownership Verification**: Users can only read, update, or delete their own projects and tasks. Attempting to access another user's project returns HTTP 403 Forbidden.
- **Project Association**: When creating a task, the service verifies that the `projectId` exists in MySQL and belongs to the requesting user.
- **Resource Not Found**: Invalid IDs or missing records return a clean HTTP 404 response.
- **Centralized Error Middleware**: Formats all errors into a consistent JSON response with appropriate status codes (400, 401, 403, 404, 409, 500).
# backend-music-project
