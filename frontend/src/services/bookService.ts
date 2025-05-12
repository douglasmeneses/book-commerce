import axios from "axios";
import { Filter } from "@/types/bookTypes";
import { cleanToken } from "@/utils/tokenUtils";

const API_URL = "https://backend-llyr.onrender.com/books";

const ApiRequest = async (
  method: "get" | "post" | "put" | "delete",
  url: string,
  data?: any
) => {
  let token = "";
  let refreshToken = "";

  if (typeof window !== "undefined") {
    token = cleanToken(localStorage.getItem("token") || "");
    refreshToken = cleanToken(localStorage.getItem("refreshToken") || "");
  }
  try {
    const tokenConfig = {
      headers: {
        authorization: `Bearer ${token}`,
        "x-refresh-token": refreshToken,
      },
    };
    const response = data
      ? await axios[method](url, data, tokenConfig)
      : await axios[method](url, tokenConfig);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Error with request.");
    }
    throw new Error("Something went wrong with the request.");
  }
};

export const getBooks = async (filtro: Filter, user_uuid?: string) => {
  try {
    const filter = {
      params: { ...filtro, user_uuid: user_uuid ? user_uuid : "" },
    };

    return ApiRequest("get", API_URL, filter);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro ao buscrar livros.";
    return errorMessage;
  }
};

export const getFavoriteBooks = async (user_uuid: string) => {
  try {
    const url = `https://backend-llyr.onrender.com/favorites/user/${user_uuid}/`;
    return ApiRequest("get", url);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro ao buscar livros.";
    return errorMessage;
  }
};

export const getBookByUUID = async (uuid: string) => {
  try {
    const url = `${API_URL}/${uuid}`;
    return ApiRequest("get", url);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro ao buscar livro.";
    return errorMessage;
  }
};
