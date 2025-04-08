import axios from "axios";
import { Filter } from "@/types/bookTypes";

const API_URL = "http://localhost:3001/books";

export const getBooks = async (filtro: Filter) => {
  try {
    const response = await axios.get(API_URL, {
      params: { ...filtro },
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro ao buscrar livros.";
    return errorMessage;
  }
};
