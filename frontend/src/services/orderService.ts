import axios from "axios";
import { cleanToken, handleNewToken } from "../utils/tokenUtils";

const API_URL = "http://localhost:3001/orders";

const TOKEN = cleanToken(localStorage.getItem("token") || "");
const REFRESH_TOKEN = cleanToken(localStorage.getItem("refreshToken") || "");

const ApiRequest = async (
  method: "get" | "post" | "put" | "delete",
  url: string,
  data?: any
) => {
  try {
    const tokenConfig = {
      headers: {
        authorization: `Bearer ${TOKEN}`,
        "x-refresh-token": REFRESH_TOKEN,
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

export const getOrdersByUser = async (user_uuid: string) => {
  const url = `${API_URL}/user/${user_uuid}`;
  return ApiRequest("get", url);
};
