# API Documentation

Comprehensive reference for all RESTful endpoints in the **Project & Task Management API**.

- **Base URL**: `http://localhost:5000/api`
- **Content-Type**: `application/json`
- **Authentication**: JWT Bearer Token (`Authorization: Bearer <token>`)

---

## Standard Response Structure

### Success Response
```json
{
  "success": true,
  "message": "Human readable confirmation message",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address",
      "value": "invalid-email"
    }
  ]
}
```

---

## 1. Authentication APIs (MySQL)

### 1.1 Register User
- **Method**: `POST`
- **URL**: `/api/auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "name": "Alex Johnson",
  "email": "alex@example.com",
  "password": "Password123"
}
```
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "user": {
      "id": 1,
      "name": "Alex Johnson",
      "email": "alex@example.com",
      "createdAt": "2026-10-26T15:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 1.2 Login User
- **Method**: `POST`
- **URL**: `/api/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "alex@example.com",
  "password": "Password123"
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": {
      "id": 1,
      "name": "Alex Johnson",
      "email": "alex@example.com",
      "createdAt": "2026-10-26T15:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 1.3 Get Current User Profile
- **Method**: `GET`
- **URL**: `/api/auth/me`
- **Access**: Private (`Bearer <token>`)
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "User profile retrieved successfully.",
  "data": {
    "user": {
      "id": 1,
      "name": "Alex Johnson",
      "email": "alex@example.com",
      "createdAt": "2026-10-26T15:00:00.000Z",
      "updatedAt": "2026-10-26T15:00:00.000Z"
    }
  }
}
```

---

### 1.4 Update User Profile
- **Method**: `PUT`
- **URL**: `/api/auth/profile`
- **Access**: Private (`Bearer <token>`)
- **Request Body** (all fields optional):
```json
{
  "name": "Alex J. Updated",
  "email": "alex.updated@example.com",
  "password": "NewSecretPassword123"
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Profile updated successfully.",
  "data": {
    "user": {
      "id": 1,
      "name": "Alex J. Updated",
      "email": "alex.updated@example.com",
      "updatedAt": "2026-10-26T15:10:00.000Z"
    }
  }
}
```

---

## 2. Project Management APIs (MySQL)
*All Project endpoints require `Authorization: Bearer <token>`.*

### 2.1 Create Project
- **Method**: `POST`
- **URL**: `/api/projects`
- **Request Body**:
```json
{
  "title": "Music Streaming Platform",
  "description": "High performance audio streaming backend",
  "status": "active"
}
```
- **Status options**: `active` (default), `completed`, `archived`
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Project created successfully.",
  "data": {
    "project": {
      "id": 1,
      "title": "Music Streaming Platform",
      "description": "High performance audio streaming backend",
      "status": "active",
      "userId": 1,
      "createdAt": "2026-10-26T15:15:00.000Z",
      "updatedAt": "2026-10-26T15:15:00.000Z"
    }
  }
}
```

---

### 2.2 Get All Projects
- **Method**: `GET`
- **URL**: `/api/projects`
- **Description**: Returns all projects owned by the authenticated user.
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Projects retrieved successfully.",
  "data": {
    "count": 1,
    "projects": [
      {
        "id": 1,
        "title": "Music Streaming Platform",
        "description": "High performance audio streaming backend",
        "status": "active",
        "userId": 1,
        "createdAt": "2026-10-26T15:15:00.000Z",
        "updatedAt": "2026-10-26T15:15:00.000Z"
      }
    ]
  }
}
```

---

### 2.3 Get Project by ID
- **Method**: `GET`
- **URL**: `/api/projects/:id`
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Project retrieved successfully.",
  "data": {
    "project": {
      "id": 1,
      "title": "Music Streaming Platform",
      "description": "High performance audio streaming backend",
      "status": "active",
      "userId": 1,
      "createdAt": "2026-10-26T15:15:00.000Z",
      "updatedAt": "2026-10-26T15:15:00.000Z"
    }
  }
}
```

---

### 2.4 Update Project
- **Method**: `PUT`
- **URL**: `/api/projects/:id`
- **Request Body**:
```json
{
  "title": "Music Streaming Platform v2",
  "status": "completed"
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Project updated successfully.",
  "data": {
    "project": {
      "id": 1,
      "title": "Music Streaming Platform v2",
      "description": "High performance audio streaming backend",
      "status": "completed",
      "userId": 1,
      "updatedAt": "2026-10-26T15:20:00.000Z"
    }
  }
}
```

---

### 2.5 Delete Project
- **Method**: `DELETE`
- **URL**: `/api/projects/:id`
- **Description**: Deletes the project from MySQL and automatically cascade-deletes all associated tasks from MongoDB.
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Project 1 and associated tasks deleted successfully."
}
```

---

## 3. Task Management APIs (MongoDB)
*All Task endpoints require `Authorization: Bearer <token>`.*

### 3.1 Create Task
- **Method**: `POST`
- **URL**: `/api/tasks`
- **Description**: Creates a task. Validates that `projectId` exists in MySQL and is owned by the user.
- **Request Body**:
```json
{
  "title": "Design Database Schemas",
  "description": "Design Sequelize and Mongoose models",
  "status": "todo",
  "priority": "high",
  "projectId": 1,
  "dueDate": "2026-11-05T18:00:00.000Z"
}
```
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Task created successfully.",
  "data": {
    "task": {
      "_id": "671ccbe3176e621a5bec2554",
      "title": "Design Database Schemas",
      "description": "Design Sequelize and Mongoose models",
      "status": "todo",
      "priority": "high",
      "projectId": 1,
      "userId": 1,
      "dueDate": "2026-11-05T18:00:00.000Z",
      "createdAt": "2026-10-26T15:25:00.000Z",
      "updatedAt": "2026-10-26T15:25:00.000Z"
    }
  }
}
```

---

### 3.2 Get All Tasks (Pagination & Filtering)
- **Method**: `GET`
- **URL**: `/api/tasks`
- **Query Parameters**:
  - `page` (Integer, default: `1`)
  - `limit` (Integer, default: `10`, max: `100`)
  - `status` (`todo` | `in_progress` | `completed`)
  - `priority` (`low` | `medium` | `high`)
  - `projectId` (Integer)
- **Example**:
  `GET /api/tasks?page=1&limit=10&status=todo&priority=high`
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Tasks retrieved successfully.",
  "data": {
    "tasks": [
      {
        "_id": "671ccbe3176e621a5bec2554",
        "title": "Design Database Schemas",
        "description": "Design Sequelize and Mongoose models",
        "status": "todo",
        "priority": "high",
        "projectId": 1,
        "userId": 1,
        "dueDate": "2026-11-05T18:00:00.000Z",
        "createdAt": "2026-10-26T15:25:00.000Z",
        "updatedAt": "2026-10-26T15:25:00.000Z"
      }
    ],
    "pagination": {
      "totalRecords": 1,
      "totalPages": 1,
      "currentPage": 1,
      "limit": 10,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
}
```

---

### 3.3 Get Task by ID
- **Method**: `GET`
- **URL**: `/api/tasks/:id`
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Task retrieved successfully.",
  "data": {
    "task": {
      "_id": "671ccbe3176e621a5bec2554",
      "title": "Design Database Schemas",
      "status": "todo",
      "priority": "high",
      "projectId": 1,
      "userId": 1
    }
  }
}
```

---

### 3.4 Update Task
- **Method**: `PUT`
- **URL**: `/api/tasks/:id`
- **Request Body**:
```json
{
  "status": "in_progress",
  "priority": "medium"
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Task updated successfully.",
  "data": {
    "task": {
      "_id": "671ccbe3176e621a5bec2554",
      "title": "Design Database Schemas",
      "status": "in_progress",
      "priority": "medium",
      "updatedAt": "2026-10-26T15:30:00.000Z"
    }
  }
}
```

---

### 3.5 Delete Task
- **Method**: `DELETE`
- **URL**: `/api/tasks/:id`
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Task 671ccbe3176e621a5bec2554 deleted successfully."
}
```

---

## 4. Dashboard Statistics API

### 4.1 Get Dashboard Statistics
- **Method**: `GET`
- **URL**: `/api/dashboard`
- **Access**: Private (`Bearer <token>`)
- **Description**: Gathers project counts from MySQL and task metrics from MongoDB for the authenticated user.
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Dashboard statistics retrieved successfully.",
  "data": {
    "projects": {
      "total": 3,
      "active": 2,
      "completed": 1
    },
    "tasks": {
      "total": 8,
      "pending": 5,
      "completed": 3,
      "highPriority": 2
    },
    "summary": {
      "totalProjects": 3,
      "activeProjects": 2,
      "completedProjects": 1,
      "totalTasks": 8,
      "pendingTasks": 5,
      "completedTasks": 3,
      "highPriorityTasks": 2
    }
  }
}
```
