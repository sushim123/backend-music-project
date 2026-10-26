# Database Setup Instructions

This document provides setup instructions for both **MySQL** (Relational Database) and **MongoDB** (NoSQL Document Store).

---

## 1. Architecture & Design Decisions

The application adopts a **hybrid polyglot persistence architecture**:
- **MySQL**: Handles structured, relational data where ACID compliance and foreign key integrity are critical:
  - `users`: User identity, authentication credentials, and profiles.
  - `projects`: Project records owned by users with strict referential constraints (`ON DELETE CASCADE`).
- **MongoDB**: Handles flexible, semi-structured task items:
  - `tasks`: Dynamic workflow items linked by `projectId` and `userId`, indexed for fast filtering and pagination.

---

## 2. MySQL Configuration & Setup

### Prerequisites
- MySQL Server 8.0+ or XAMPP / MariaDB running on port `3306`.

### Option A: Automatic Initialization (Recommended)
The application uses Sequelize ORM. When you start the server via `npm run dev`, it will automatically:
1. Connect to the database specified in `.env`.
2. Automatically create the `users` and `projects` tables.
3. Establish foreign key relationships.

*Ensure the database exists before starting:*
```sql
CREATE DATABASE IF NOT EXISTS `project_management_db`
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### Option B: Manual SQL Setup (Using schema.sql)
You can manually execute the provided [`database/schema.sql`](file:///c:/Users/Asus/OneDrive/Desktop/New%20folder%20%283%29/backend/database/schema.sql) in MySQL Workbench, phpMyAdmin, or MySQL CLI:

```bash
mysql -u root -p < database/schema.sql
```

#### SQL Schema Definitions:

```sql
CREATE DATABASE IF NOT EXISTS `project_management_db`
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `project_management_db`;

-- Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Projects Table
CREATE TABLE IF NOT EXISTS `projects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NULL,
  `status` ENUM('active', 'completed', 'archived') NOT NULL DEFAULT 'active',
  `userId` INT NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_projects_userId` (`userId`),
  CONSTRAINT `fk_projects_userId`
    FOREIGN KEY (`userId`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;
```

---

## 3. MongoDB Configuration & Setup

### Option A: Local MongoDB
1. Ensure the MongoDB service is running:
   ```bash
   mongod
   ```
2. Set the connection string in your `.env`:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/task_management_db
   ```

### Option B: MongoDB Atlas (Cloud)
1. In your MongoDB Atlas cluster:
   - Create a database user under **Security > Database Access**.
   - Under **Security > Network Access**, whitelist your IP or allow access from anywhere (`0.0.0.0/0`).
2. Add your connection URI to `.env`:
   ```env
   MONGO_URI=mongodb+srv://sushimsushi8699_db_user:e2W6p2ZwrvDlAKM3@projectmanagement.iio5bfx.mongodb.net/task_management_db?retryWrites=true&w=majority
   ```

#### MongoDB Task Collection Schema & Indexes:
- **Collection Name**: `tasks`
- **Fields**:
  - `title` (String, required, 2-200 chars)
  - `description` (String, optional)
  - `status` (`'todo'` | `'in_progress'` | `'completed'`, default `'todo'`)
  - `priority` (`'low'` | `'medium'` | `'high'`, default `'medium'`)
  - `projectId` (Number, indexed, corresponds to MySQL `projects.id`)
  - `userId` (Number, indexed, corresponds to MySQL `users.id`)
  - `dueDate` (Date, optional)
  - `createdAt`, `updatedAt` (Automated timestamps)
- **Compound Index**: `{ userId: 1, projectId: 1, status: 1, priority: 1 }` for high-performance filtering.

---

## 4. Verification Check

To verify connectivity to both databases:
```bash
npm run dev
```

Expected terminal log:
```text
🔄 Initializing database connections...
✅ Connected to MySQL successfully.
✅ MySQL tables synchronized.
✅ Connected to MongoDB successfully.
🚀 Server running in development mode on port 5000
```
