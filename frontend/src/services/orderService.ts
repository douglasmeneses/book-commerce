import axios, { AxiosResponse } from "axios";
import { cleanToken } from "@/utils/cartUtils";
import { Book } from "@/types/bookTypes";

const API_URL = "http://localhost:3001/orders";

const TOKEN = cleanToken(localStorage.getItem("token") || "");
const REFRESH_TOKEN = cleanToken(localStorage.getItem("refreshToken") || "");

const handleNewToken = (response: AxiosResponse<any, any>): void => {
  const authHeader = response.headers["authorization"] as string | undefined;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    localStorage.setItem("token", cleanToken(authHeader));
  }
};

export const getOrdersByUser = async (user_uuid: string): Promise<Book[]> => {
  try {
    const response = await axios.get(`${API_URL}/user/${user_uuid}`, {
      headers: {
        authorization: `Bearer ${TOKEN}`,
        "x-refresh-token": REFRESH_TOKEN,
      },
    });
    handleNewToken(response);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching orders.");
  }
};
