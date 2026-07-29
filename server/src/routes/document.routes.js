import express from "express";
import upload from "../middleware/upload.middleware.js";
import { protect } from "../middleware/auth.middleware.js";
import { uploadDocument } from "../controllers/document.controller.js";

const router = express.Router();

router.post(
    "/upload",
    protect,
    upload.single("pdf"),
    uploadDocument
);

export default router;