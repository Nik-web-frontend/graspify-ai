import { createChat as createChatService } from "../services/chat.service.js";

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