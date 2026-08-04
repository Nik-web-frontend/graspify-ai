import Document from "../models/document.model.js";
import { processDocument } from "./python.service.js";
import path from "path";
import Chat from "../models/chat.model.js";

export const uploadDocument = async ({ file, user, chatId }) => {

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

        await Chat.findByIdAndUpdate(
            chatId,
            {
                $push: {
                    documents: document._id,
                },
            }
        );
    }
    catch (error) {
        document.processingStatus = "failed";
        await document.save();

        throw new Error(error.message);
    }

    return document;
};