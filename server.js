
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./config/db.js";
import studentRoutes from "./routes/studentRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Database connection test
app.get("/api/health", async (req, res) => {
    try {
        await pool.query("SELECT 1");

        res.json({
            success: true,
            message: "MySQL connected successfully!"
        });
    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});

// Student APIs
app.use("/api/students", studentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});