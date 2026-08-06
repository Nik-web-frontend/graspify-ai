import { createChat as createChatService } from "../services/chat.service.js";
import { askQuestionInChat, getChatMessages, getUserChats } from "../services/chat.service.js";

export const createChat = async (req, res) => {
    try {
        const chat = await createChatService({
            user: req.user,
        });

        res.status(201).json({
            success: true,
            message: "Chat created successfully.",
            chat,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const askQuestion = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { question } = req.body;

        const response = await askQuestionInChat({
            chatId,
            question,
        });

        res.status(200).json(response);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { chatId } = req.params;

        const messages = await getChatMessages(chatId);

        res.status(200).json({
            success: true,
            messages,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getChats = async (req, res) => {
    try {
        const chats = await getUserChats(req.user._id);

        res.status(200).json({
            success: true,
            chats,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};