import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { askQuestion, createChat, getMessages, getChats, getChat } from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/", protect, createChat);

router.post("/:chatId/ask", protect, askQuestion)

router.get("/:chatId/messages", protect, getMessages);

router.get("/", protect, getChats)

router.get("/:chatId", protect, getChat);

export default router;