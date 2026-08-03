import Document from "../models/document.model.js";
import { processDocument } from "./python.service.js";
import path from "path";

export const uploadDocument = async ({ file, user }) => {

    const document = await Document.create({
        title: file.originalname.replace(".pdf", ""),
        originalFileName: file.originalname,
        storedFileName: file.filename,
        filePath: file.path,
        fileSize: file.size,
        mimeType: file.mimetype,
        uploadedBy: user._id,
    });

    document.processingStatus = "processing";
    await document.save();

    try {

        await processDocument({
            file_path: path.resolve(document.filePath),
            document_id: document._id.toString(),
            user_id: document.uploadedBy.toString(),
            title: document.title,
        });

        document.processingStatus = "completed";
        await document.save();
    }
    catch (error) {
        document.processingStatus = "failed";
        await document.save();

        throw new Error("Failed to process document.");
    }

    return document;
};