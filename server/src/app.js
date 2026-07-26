import express from "express";
import cors from "cors";
import axios from "axios";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Graspify AI Backend is running 🚀",
  });
});

app.get("/api/test-python", async (req, res) => {
    try {
        const response = await axios.get("http://127.0.0.1:8000/health");

        res.json({
            success: true,
            pythonResponse: response.data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to communicate with Python service."
        });
    }
});

export default app;