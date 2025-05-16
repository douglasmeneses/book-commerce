import axios from "axios";
import { cleanToken, handleNewToken } from "../utils/tokenUtils";
import { Order } from "@/types/orderTypes";

const API_URL = "https://backend-llyr.onrender.com/orders";

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

export const getOrdersByUser = async (user_uuid: string) => {
  const url = `${API_URL}/user/${user_uuid}`;
  return ApiRequest("get", url);
};

export const getOrderById = async (orderId: number): Promise<Order> => {
  const url = `${API_URL}/by-id/${orderId}`;
  return ApiRequest("get", url);
};

export const createOrder = async (
  user_uuid: string,
  orderData: Partial<Order>
): Promise<Order> => {
  const url = `${API_URL}/${user_uuid}`;
  return ApiRequest("post", url, orderData);
};

export const updateOrder = async (
  user_uuid: string,
  updatedData: Partial<Order>
): Promise<Order> => {
  const url = `${API_URL}/${user_uuid}`;
  return ApiRequest("put", url, updatedData);
};

export const deleteOrder = async (
  user_uuid: string
): Promise<{ message: string }> => {
  const url = `${API_URL}/${user_uuid}`;
  return ApiRequest("delete", url);
};
