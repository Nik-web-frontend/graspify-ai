import Chat from "../models/chat.model.js";
import { askQuestion } from "./python.service.js";
import Message from "../models/message.model.js";

export const createChat = async ({ user }) => {
  const chat = await Chat.create({
    user: user._id,
    title: "New Chat",
  });

  return chat;
};

export const askQuestionInChat = async ({ chatId, question }) => {
  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw new Error("Chat not found.");
  }
  if (chat.documents.length === 0) {
    throw new Error("No document found in this chat.");
  }

  const documentId = chat.documents[0];

  await Message.create({
    chat: chatId,
    role: "user",
    content: question,
  });

  const response = await askQuestion({
    document_id: documentId.toString(),
    question,
  });

  await Message.create({
    chat: chatId,
    role: "assistant",
    content: response.answer,
  });

  return response;
};

export const getChatMessages = async (chatId) => {
  const messages = await Message.find({
    chat: chatId,
  }).sort({
    createdAt: 1,
  });

  return messages;
};