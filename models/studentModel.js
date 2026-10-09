
import pool from "../config/db.js";

// Get all students with course names
export const getAllStudents = async () => {
    const [rows] = await pool.query(`
        SELECT
            s.id,
            s.full_name,
            s.email,
            s.phone,
            s.course_id,
            c.course_name,
            s.created_at
        FROM students s
        LEFT JOIN courses c ON s.course_id = c.id
        ORDER BY s.id DESC
    `);

    return rows;
};

// Get student by ID
export const getStudentById = async (id) => {
    const [rows] = await pool.execute(
        `SELECT
            s.id,
            s.full_name,
            s.email,
            s.phone,
            s.course_id,
            c.course_name,
            s.created_at,
            s.updated_at
         FROM students s
         LEFT JOIN courses c ON s.course_id = c.id
         WHERE s.id = ?`,
        [id]
    );

    return rows[0];
};

// Create student
export const createStudent = async (student) => {
    const { full_name, email, phone, course_id } = student;

    const [result] = await pool.execute(
        `INSERT INTO students
            (full_name, email, phone, course_id)
         VALUES (?, ?, ?, ?)`,
        [
            full_name,
            email,
            phone || null,
            course_id || null
        ]
    );

    return result.insertId;
};

// Update student
export const updateStudent = async (id, student) => {
    const { full_name, email, phone, course_id } = student;

    const [result] = await pool.execute(
        `UPDATE students
         SET full_name = ?,
             email = ?,
             phone = ?,
             course_id = ?
         WHERE id = ?`,
        [
            full_name,
            email,
            phone || null,
            course_id || null,
            id
        ]
    );

    return result.affectedRows;
};

// Delete student
export const deleteStudent = async (id) => {
    const [result] = await pool.execute(
        "DELETE FROM students WHERE id = ?",
        [id]
    );

    return result.affectedRows;
};

// Get all courses
export const getAllCourses = async () => {
    const [rows] = await pool.query(
        `SELECT id, course_name
         FROM courses
         ORDER BY course_name ASC`
    );

    return rows;
};

// Advanced search and sorting
export const searchAndSortStudents = async ({
    search = "",
    sortBy = "id",
    order = "DESC"
} = {}) => {

    // Only allow these columns for sorting
    const allowedSortColumns = {
        id: "s.id",
        name: "s.full_name",
        email: "s.email",
        phone: "s.phone",
        course: "c.course_name",
        date: "s.created_at"
    };

    const column = allowedSortColumns[sortBy] || "s.id";

    const direction =
        String(order).toUpperCase() === "ASC"
            ? "ASC"
            : "DESC";

    const searchValue = `%${search}%`;

    const [rows] = await pool.execute(
        `SELECT
            s.id,
            s.full_name,
            s.email,
            s.phone,
            s.course_id,
            c.course_name,
            s.created_at
         FROM students s
         LEFT JOIN courses c ON s.course_id = c.id
         WHERE s.full_name LIKE ?
            OR s.email LIKE ?
            OR s.phone LIKE ?
            OR c.course_name LIKE ?
         ORDER BY ${column} ${direction}`,
        [
            searchValue,
            searchValue,
            searchValue,
            searchValue
        ]
    );

    return rows;
};