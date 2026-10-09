
import * as Student from "../models/studentModel.js";

// Validate student ID
const validId = (id) =>
    /^\d+$/.test(String(id)) && Number(id) > 0;

// Validate student form data
const validateStudent = (body) => {
    const { full_name, email, phone, course_id } = body;

    if (typeof full_name !== "string" || !full_name.trim()) {
        return "Student name is required";
    }

    if (full_name.trim().length > 100) {
        return "Name must be 100 characters or fewer";
    }

    if (
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
        return "Enter a valid email address";
    }

    if (email.trim().length > 150) {
        return "Email must be 150 characters or fewer";
    }

    if (
        phone != null &&
        phone !== "" &&
        (
            typeof phone !== "string" ||
            phone.trim().length > 20
        )
    ) {
        return "Phone must be 20 characters or fewer";
    }

    if (
        course_id != null &&
        course_id !== "" &&
        (!/^\d+$/.test(String(course_id)) || Number(course_id) <= 0)
    ) {
        return "Invalid course ID";
    }

    return null;
};

// Handle database errors
const handleError = (res, error) => {
    if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
            success: false,
            message: "This email is already registered"
        });
    }

    if (
        error.code === "ER_NO_REFERENCED_ROW_2" ||
        error.code === "ER_NO_REFERENCED_ROW"
    ) {
        return res.status(400).json({
            success: false,
            message: "Selected course does not exist"
        });
    }

    console.error(error.message);

    return res.status(500).json({
        success: false,
        message: "Internal server error"
    });
};

// GET all students + advanced search + sorting
export const getStudents = async (req, res) => {
    try {
        const search =
            typeof req.query.search === "string"
                ? req.query.search.trim().slice(0, 100)
                : "";

        const sortBy =
            typeof req.query.sortBy === "string"
                ? req.query.sortBy
                : "id";

        const order =
            typeof req.query.order === "string"
                ? req.query.order
                : "DESC";

        const students = await Student.searchAndSortStudents({
            search,
            sortBy,
            order
        });

        return res.json({
            success: true,
            count: students.length,
            data: students
        });
    } catch (error) {
        return handleError(res, error);
    }
};

// GET one student
export const getStudent = async (req, res) => {
    if (!validId(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid student ID"
        });
    }

    try {
        const student = await Student.getStudentById(
            Number(req.params.id)
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        return res.json({
            success: true,
            data: student
        });
    } catch (error) {
        return handleError(res, error);
    }
};

// CREATE student
export const addStudent = async (req, res) => {
    const validationError = validateStudent(req.body);

    if (validationError) {
        return res.status(400).json({
            success: false,
            message: validationError
        });
    }

    const student = {
        full_name: req.body.full_name.trim(),
        email: req.body.email.trim(),
        phone:
            typeof req.body.phone === "string"
                ? req.body.phone.trim() || null
                : null,
        course_id:
            req.body.course_id === "" ||
            req.body.course_id == null
                ? null
                : Number(req.body.course_id)
    };

    try {
        const id = await Student.createStudent(student);

        return res.status(201).json({
            success: true,
            message: "Student added successfully",
            id
        });
    } catch (error) {
        return handleError(res, error);
    }
};

// UPDATE student
export const editStudent = async (req, res) => {
    if (!validId(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid student ID"
        });
    }

    const validationError = validateStudent(req.body);

    if (validationError) {
        return res.status(400).json({
            success: false,
            message: validationError
        });
    }

    const student = {
        full_name: req.body.full_name.trim(),
        email: req.body.email.trim(),
        phone:
            typeof req.body.phone === "string"
                ? req.body.phone.trim() || null
                : null,
        course_id:
            req.body.course_id === "" ||
            req.body.course_id == null
                ? null
                : Number(req.body.course_id)
    };

    try {
        const affectedRows = await Student.updateStudent(
            Number(req.params.id),
            student
        );

        if (!affectedRows) {
            return res.status(404).json({
                success: false,
                message: "Student not found or no changes made"
            });
        }

        return res.json({
            success: true,
            message: "Student updated successfully"
        });
    } catch (error) {
        return handleError(res, error);
    }
};

// DELETE student
export const removeStudent = async (req, res) => {
    if (!validId(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid student ID"
        });
    }

    try {
        const affectedRows = await Student.deleteStudent(
            Number(req.params.id)
        );

        if (!affectedRows) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        return res.json({
            success: true,
            message: "Student deleted successfully"
        });
    } catch (error) {
        return handleError(res, error);
    }
};

// GET courses for dropdown
export const getCourses = async (req, res) => {
    try {
        const courses = await Student.getAllCourses();

        return res.json({
            success: true,
            data: courses
        });
    } catch (error) {
        return handleError(res, error);
    }
};