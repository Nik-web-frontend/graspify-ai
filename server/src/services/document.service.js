import Document from "../models/document.model.js";
import path from "path";
import Chat from "../models/chat.model.js";

import fs from "fs/promises";
import {
    processDocument,
    deleteDocumentFromPython
} from "./python.service.js";

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
                $set: {
                    title: document.title,
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

export const deleteDocument = async ({
    chatId,
    documentId,
    user,
}) => {

    const chat = await Chat.findOne({
        _id: chatId,
        user: user._id,
    });

    if (!chat) {
        throw new Error("Chat not found.");
    }

    const documentExists = chat.documents.some(
        (id) => id.toString() === documentId
    );

    if (!documentExists) {
        throw new Error("Document not found in this chat.");
    }

    const document = await Document.findById(documentId);

    if (!document) {
        throw new Error("Document not found.");
    }

    // Delete embeddings from Chroma
    await deleteDocumentFromPython(
        document._id.toString()
    );

    // Delete physical PDF
    try {
        await fs.unlink(document.filePath);
    } catch (error) {
        console.log(
            "PDF file could not be deleted:",
            error.message
        );
    }

    // Remove only this document from Chat
    await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: {
                documents: documentId,
            },
        }
    );

    // Delete document from MongoDB
    await Document.findByIdAndDelete(documentId);

    return document;
};

export const getChatDocuments = async ({ chatId, user }) => {
    const chat = await Chat.findOne({
        _id: chatId,
        user: user._id,
    }).populate("documents");

    if (!chat) {
        throw new Error("Chat not found.");
    }

    return chat.documents;
};