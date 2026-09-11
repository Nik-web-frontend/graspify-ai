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

export const uploadDocument = async (chatId, file) => {
  const formData = new FormData();

  formData.append("pdf", file);

  const response = await API.post(
    `/documents/${chatId}/upload`,
    formData
  );

  return response.data;
};

export const getDocuments = async (chatId) => {
  const response = await API.get(
    `/documents/${chatId}`
  );

  return response.data;
};

export const deleteDocument = async (
  chatId,
  documentId
) => {
  const response = await API.delete(
    `/documents/${chatId}/${documentId}`
  );

  return response.data;
};