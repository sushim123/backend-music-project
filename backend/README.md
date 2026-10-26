# Project & Task Management API

A production-ready RESTful API built with **Node.js, Express, ES Modules, MySQL (Sequelize), and MongoDB (Mongoose)** for managing users, projects, tasks, and analytics dashboards.

---

## 📚 Documentation Quick Links

- 🗄️ **[Database Setup Instructions](./DATABASE_SETUP.md)** — Step-by-step setup for MySQL & MongoDB Atlas, table schemas, and indexes.
- 📡 **[API Documentation](./API_DOCUMENTATION.md)** — Complete endpoint specifications, query filters, pagination, and request/response payloads.
- 🧪 **[Postman Collection](./postman_collection.json)** — Ready-to-import Postman / Thunder Client collection with automated auth token flow.
- 📜 **[MySQL Schema Script](./database/schema.sql)** — Raw SQL schema definitions for manual database import.

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
- **MongoDB**: MongoDB Community Server on port `27017` or MongoDB Atlas URI

### 2. Install Dependencies
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
*Note: The Sequelize ORM will automatically create and sync all tables (`users` and `projects`) when the application starts. Alternatively, you can run the SQL script found in [`database/schema.sql`](./database/schema.sql).*

#### MongoDB:
The project is configured to connect directly to the deployed **MongoDB Atlas** cluster:
`mongodb+srv://sushimsushi8699_db_user:e2W6p2ZwrvDlAKM3@projectmanagement.iio5bfx.mongodb.net/`
*(Local MongoDB `mongodb://127.0.0.1:27017/task_management_db` is also supported).*

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

## 📡 API Reference Overview

For full request and response examples, visit **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**.

### Summary of Endpoints:

#### 1. Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user | No |
| `POST` | `/api/auth/login` | User login & JWT issuance | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |
| `PUT` | `/api/auth/profile` | Update profile information | Yes |

#### 2. Project Management (`/api/projects`) — MySQL
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/projects` | Create a new project | Yes |
| `GET` | `/api/projects` | List all projects belonging to user | Yes |
| `GET` | `/api/projects/:id` | Get details of a single project | Yes |
| `PUT` | `/api/projects/:id` | Update project title/description/status | Yes |
| `DELETE` | `/api/projects/:id` | Delete project and cascade-delete tasks | Yes |

#### 3. Task Management (`/api/tasks`) — MongoDB
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/tasks` | Create task associated with project & user | Yes |
| `GET` | `/api/tasks` | Get paginated & filtered list of tasks | Yes |
| `GET` | `/api/tasks/:id` | Get task by Mongo ObjectId | Yes |
| `PUT` | `/api/tasks/:id` | Update task status, priority, or details | Yes |
| `DELETE` | `/api/tasks/:id` | Delete task | Yes |

#### 4. Dashboard Statistics (`/api/dashboard`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/dashboard` | Aggregated metrics across MySQL & MongoDB | Yes |

---

## 🧪 Testing with Postman / Thunder Client

A pre-configured Postman collection is included in the project:
- **[`postman_collection.json`](./postman_collection.json)**

### Steps to Test:
1. Open Postman or Thunder Client in VS Code.
2. Click **Import** and select `postman_collection.json`.
3. The collection has automatic token extraction:
   - When you call **POST Register** or **POST Login**, the returned JWT token is automatically saved to the collection variable `authToken`.
   - Subsequent requests (Projects, Tasks, Dashboard) automatically use `Bearer {{authToken}}`.
