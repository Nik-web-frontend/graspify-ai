import { uploadDocument as uploadDocumentService } from "../services/document.service.js";

export const uploadDocument = async (req, res) => {
    try {
        const document = await uploadDocumentService({
            file: req.file,
            user: req.user,
        });

        res.status(201).json({
            success: true,
            message: "Document uploaded successfully.",
            document,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};