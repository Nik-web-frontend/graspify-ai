import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const createChat = async () => {
  const response = await API.post("/chats");

  return response.data;
};

export const getChats = async () => {
  const response = await API.get("/chats");

  return response.data;
};

export const getMessages = async (chatId) => {
  const response = await API.get(`/chats/${chatId}/messages`);

  return response.data;
};

export const askQuestion = async (chatId, question) => {
    const response = await API.post(`/chats/${chatId}/ask`, {
        question,
    });

    return response.data;
};