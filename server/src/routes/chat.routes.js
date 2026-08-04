import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { createChat } from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/", protect, createChat);

export default router;