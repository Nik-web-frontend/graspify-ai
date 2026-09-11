import {
    uploadDocument as uploadDocumentService,
    deleteDocument as deleteDocumentService,
    getChatDocuments as getChatDocumentsService
} from "../services/document.service.js";


export const uploadDocument = async (req, res) => {
    try {
        const { chatId } = req.params;

        const document = await uploadDocumentService({
            file: req.file,
            user: req.user,
            chatId
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

export const deleteDocument = async (req, res) => {

    try {

        const { chatId, documentId } = req.params;

        const document = await deleteDocumentService({
            chatId,
            documentId,
            user: req.user,
        });

        res.status(200).json({
            success: true,
            message: "Document deleted successfully.",
            document,
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message,
        });

    }
};

export const getChatDocuments = async (req, res) => {
    try {
        const { chatId } = req.params;

        const documents = await getChatDocumentsService({
            chatId,
            user: req.user,
        });

        res.status(200).json({
            success: true,
            documents,
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};