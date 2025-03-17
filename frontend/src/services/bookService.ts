import axios from "axios";

const API_URL = "http://localhost:3000/books";

export const getBooks = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro ao buscrar livros.";
    return errorMessage;
  }
};
