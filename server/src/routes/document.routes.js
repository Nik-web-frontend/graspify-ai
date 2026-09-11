import express from "express";
import upload from "../middleware/upload.middleware.js";
import { protect } from "../middleware/auth.middleware.js";
import { uploadDocument, deleteDocument, getChatDocuments } from "../controllers/document.controller.js";

const router = express.Router();

router.post(
    "/:chatId/upload",
    protect,
    upload.single("pdf"),
    uploadDocument
);

router.delete(
    "/:chatId/:documentId",
    protect,
    deleteDocument
);

router.get(
    "/:chatId",
    protect,
    getChatDocuments
);

export default router;