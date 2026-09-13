import Chat from "../models/chat.model.js";
import { askQuestion, deleteDocumentFromPython, generateSummary } from "./python.service.js";
import Message from "../models/message.model.js";
import Document from "../models/document.model.js";
import fs from "fs/promises";

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

  const documentIds = chat.documents.map(
    (documentId) => documentId.toString()
  );

  await Message.create({
    chat: chatId,
    role: "user",
    content: question,
  });

  const response = await askQuestion({
    document_ids: documentIds,
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

export const getUserChats = async (userId) => {
  const chats = await Chat.find({
    user: userId,
  }).sort({
    updatedAt: -1,
  });

  return chats;
};

export const getChatById = async (chatId, userId) => {
  const chat = await Chat.findOne({
    _id: chatId,
    user: userId,
  }).populate("documents");

  if (!chat) {
    throw new Error("Chat not found.");
  }

  return chat;
};

export const renameChat = async ({ chatId, userId, title }) => {
  const chat = await Chat.findOne({
    _id: chatId,
    user: userId,
  });

  if (!chat) {
    throw new Error("Chat not found.");
  }

  chat.title = title;
  await chat.save();

  return chat;
};

export const deleteChat = async ({ chatId, userId }) => {
  const chat = await Chat.findOne({
    _id: chatId,
    user: userId,
  }).populate("documents");

  if (!chat) {
    throw new Error("Chat not found.");
  }

  // Delete messages
  await Message.deleteMany({
    chat: chatId,
  });

  // Delete documents and their related data
  for (const document of chat.documents) {

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

    // Delete document from MongoDB
    await Document.findByIdAndDelete(
      document._id
    );
  }

  // Delete chat
  await Chat.findByIdAndDelete(chatId);

  return chat;
};

export const createSummary = async ({
  chatId,
  documentIds,
  user,
}) => {
  const chat = await Chat.findOne({
    _id: chatId,
    user: user._id,
  });

  if (!chat) {
    throw new Error("Chat not found.");
  }

  if (!documentIds || documentIds.length === 0) {
    throw new Error("Please select at least one document.");
  }

  const chatDocumentIds = chat.documents.map(
    (id) => id.toString()
  );

  const invalidDocument = documentIds.some(
    (id) => !chatDocumentIds.includes(id)
  );

  if (invalidDocument) {
    throw new Error(
      "One or more selected documents do not belong to this chat."
    );
  }

  await Message.create({
    chat: chatId,
    role: "user",
    content: "Generate a summary",
  });

  const response = await generateSummary({
    document_ids: documentIds,
  });

  const summary = response.summary;

  await Message.create({
    chat: chatId,
    role: "assistant",
    content: summary,
  });

  return summary;
};