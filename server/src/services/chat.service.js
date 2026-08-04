import Chat from "../models/chat.model.js";

export const createChat = async ({ user }) => {
  const chat = await Chat.create({
    user: user._id,
    title: "New Chat",
  });

  return chat;
};