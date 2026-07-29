import Document from "../models/document.model.js";

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

    return document;
};