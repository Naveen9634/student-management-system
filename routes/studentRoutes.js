
import express from "express";

import {
    getStudents,
    getStudent,
    addStudent,
    editStudent,
    removeStudent,
    getCourses
} from "../controllers/studentController.js";

const router = express.Router();

// GET all students
router.get("/", getStudents);

// GET all courses
router.get("/courses", getCourses);

// GET one student
router.get("/:id", getStudent);

// ADD student
router.post("/", addStudent);

// UPDATE student
router.put("/:id", editStudent);

// DELETE student
router.delete("/:id", removeStudent);

export default router;