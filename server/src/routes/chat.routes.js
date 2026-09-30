import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
    askQuestion,
    createChat,
    getMessages,
    getChats,
    getChat,
    renameChat,
    deleteChat,
    createSummaryController,
    createNotesController
} from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/", protect, createChat);

router.post("/:chatId/ask", protect, askQuestion)

router.get("/:chatId/messages", protect, getMessages);

router.get("/", protect, getChats)

router.get("/:chatId", protect, getChat);

router.patch("/:chatId", protect, renameChat);

router.delete("/:chatId", protect, deleteChat);

router.post(
    "/:chatId/summary",
    protect,
    createSummaryController
);

router.post(
    "/:chatId/notes",
    protect,
    createNotesController
);

export default router;