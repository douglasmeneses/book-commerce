import axios from "axios";
import { cleanToken, handleNewToken } from "../utils/tokenUtils";

const API_URL = "https://backend-llyr.onrender.com/favorites";

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
    handleNewToken(response);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Error with request.");
    }
    throw new Error("Something went wrong with the request.");
  }
};

export const favoriteBook = async (book_uuid: string, user_uuid: string) => {
  const url = `${API_URL}/book/${book_uuid}`;
  const data = { user_uuid };
  return ApiRequest("post", url, data);
};
