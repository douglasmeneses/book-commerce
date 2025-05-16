import { Cart } from "@/types/cartTypes";
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { cleanToken, handleNewToken } from "@/utils/tokenUtils";

const API_URL = "https://backend-llyr.onrender.com/carts/user";

const ApiRequest = async (
  method: "get" | "post" | "put" | "delete",
  url: string,
  data?: any
): Promise<string | Cart> => {
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

    const response: AxiosResponse<Cart> = data
      ? await axios[method](url, data, tokenConfig)
      : await axios[method](url, tokenConfig);
    handleNewToken(response);
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error with request.";
    return errorMessage;
  }
};

export const getCart = async (user_uuid: string): Promise<string | Cart> => {
  const url = `${API_URL}/${user_uuid}`;
  return ApiRequest("get", url);
};

export const addItemToCart = async (
  user_uuid: string,
  book_uuid: string,
  quantity: number
): Promise<string | Cart> => {
  const url = `${API_URL}/${user_uuid}/item/${book_uuid}`;
  const data = { quantity };
  return ApiRequest("post", url, data);
};

export const removeItemFromCart = async (
  user_uuid: string,
  cartItem_id: number,
  quantity: number
): Promise<string | Cart> => {
  const url = `${API_URL}/${user_uuid}/item/${cartItem_id}/remove`;
  const data = { user_uuid, cartItem_id, quantity };
  return ApiRequest("put", url, data);
};

export const deleteCartItem = async (
  cartItem_id: number,
  user_uuid: string
): Promise<string | Cart> => {
  const url = `${API_URL}/${user_uuid}/item/${cartItem_id}`;
  return ApiRequest("delete", url);
};
