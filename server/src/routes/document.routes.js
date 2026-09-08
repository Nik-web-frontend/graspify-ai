import express from "express";
import upload from "../middleware/upload.middleware.js";
import { protect } from "../middleware/auth.middleware.js";
import { uploadDocument, deleteDocument, getChatDocument } from "../controllers/document.controller.js";

const router = express.Router();

router.post(
    "/:chatId/upload",
    protect,
    upload.single("pdf"),
    uploadDocument
);

router.delete(
    "/:chatId",
    protect,
    deleteDocument
);

router.get(
    "/:chatId",
    protect,
    getChatDocument
);

export default router;