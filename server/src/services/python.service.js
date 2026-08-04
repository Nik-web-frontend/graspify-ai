import axios from "axios";

export const processDocument = async (data) => {
  const response = await axios.post(
    "http://127.0.0.1:8000/extract-text",
    data
  );

  return response.data;
};

export const askQuestion = async (data) => {
    const response = await axios.post(
        "http://127.0.0.1:8000/ask",
        data
    );

    return response.data;
};