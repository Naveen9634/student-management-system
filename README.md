
# Student Management System

A full-stack Student Management System built using HTML, CSS, JavaScript, Node.js, Express.js, and MySQL.

## Features

- Add, view, update, and delete student records
- Manage student courses through a relational MySQL database
- Search students by name, email, phone, or course
- Sort records by ID, name, email, phone, course, and creation date
- Frontend and backend form validation
- Parameterized SQL queries
- MVC / layered project architecture
- Error handling for duplicate emails and invalid course references

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MySQL
- Database Driver: mysql2

## Project Structure

    student-management-system/
    ├── config/
    │   └── db.js
    ├── controllers/
    │   └── studentController.js
    ├── models/
    │   └── studentModel.js
    ├── routes/
    │   └── studentRoutes.js
    ├── middleware/
    │   └── validateStudent.js
    ├── public/
    │   ├── index.html
    │   ├── css/
    │   │   └── style.css
    │   └── js/
    │       └── app.js
    ├── .env.example
    ├── .gitignore
    ├── package.json
    └── server.js

## Requirements

- Node.js and npm
- MySQL Server

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/YOUR_USERNAME/student-management-system.git
   ```

2. Enter the project directory:

   ```bash
   cd student-management-system
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create the MySQL database and tables using the SQL instructions below.

5. Create a `.env` file in the project root and configure your database credentials.

6. Start the application:

   ```bash
   npm run dev
   ```

7. Open the application at:

   http://localhost:5000

## Database Setup

Run the following SQL in MySQL:

```sql
CREATE DATABASE IF NOT EXISTS student_management;
USE student_management;

CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20),
    course_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_student_course
        FOREIGN KEY (course_id)
        REFERENCES courses(id)
        ON DELETE SET NULL
);

INSERT INTO courses (course_name)
VALUES ('BCA'), ('MCA'), ('BBA'), ('B.Tech');
```

## Environment Variables

Configure your `.env` file using the variable names expected by `config/db.js`.

Example only:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=student_management
PORT=5000
```

Adjust the variable names if your `config/db.js` uses different names. Never commit your real `.env` file or database password.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students` | List, search, and sort students |
| GET | `/api/students/:id` | Get a student |
| POST | `/api/students` | Add a student |
| PUT | `/api/students/:id` | Update a student |
| DELETE | `/api/students/:id` | Delete a student |
| GET | `/api/students/courses` | List courses |
| GET | `/api/health` | Check server/database health, if enabled |

### Search and Sorting Examples

- `/api/students?search=BCA`
- `/api/students?sortBy=name&order=ASC`
- `/api/students?sortBy=course&order=ASC`
- `/api/students?sortBy=date&order=DESC`

## Author

Naveen Shrivastav

GitHub: https://github.com/Naveen9634