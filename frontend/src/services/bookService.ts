import axios from "axios";
import { Filter } from "@/types/bookTypes";
import { cleanToken } from "@/utils/tokenUtils";

const API_URL = "http://localhost:3001/books";

const TOKEN = cleanToken(localStorage.getItem("token") || "");
const REFRESH_TOKEN = cleanToken(localStorage.getItem("refreshToken") || "");

export const getBooks = async (filtro: Filter, user_uuid?: string) => {
  try {
    const response = await axios.get(API_URL, {
      params: { ...filtro, user_uuid: user_uuid ? user_uuid : "" },
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro ao buscrar livros.";
    return errorMessage;
  }
};

export const getFavoriteBooks = async (user_uuid: string) => {
  try {
    const response = await axios.get(
      `http://localhost:3001/favorites/user/${user_uuid}/`,
      {
        headers: {
          authorization: `Bearer ${TOKEN}`,
          "x-refresh-token": REFRESH_TOKEN,
        },
      }
    );
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro ao buscar livros.";
    return errorMessage;
  }
};
