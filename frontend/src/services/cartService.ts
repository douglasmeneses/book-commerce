import { Cart } from "@/types/cartTypes";
import axios, { AxiosResponse } from "axios";
import { cleanToken } from "@/utils/cartUtils";

const API_URL = "http://localhost:3001/carts";

const TOKEN = cleanToken(localStorage.getItem("token") || "");
const REFRESH_TOKEN = cleanToken(localStorage.getItem("refreshToken") || "");

const handleNewToken = (response: AxiosResponse<any, any>): void => {
  const authHeader = response.headers["authorization"] as string | undefined;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    localStorage.setItem("token", cleanToken(authHeader));
  }
};
export const getCart = async (user_uuid: string): Promise<string | Cart> => {
  try {
    const response = await axios.get(`${API_URL}/${user_uuid}`, {
      headers: {
        authorization: `Bearer ${TOKEN}`,
        "x-refresh-token": REFRESH_TOKEN,
      },
    });
    handleNewToken(response);
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error fetching cart.";
    return errorMessage;
  }
};

export const addItemToCart = async (
  user_uuid: string,
  book_uuid: string,
  quantity: number
): Promise<string | Cart> => {
  try {
    const response = (await axios.post(
      `${API_URL}/${user_uuid}`,
      {
        book_uuid,
        quantity,
      },
      {
        headers: {
          authorization: `Bearer ${TOKEN}`,
          "x-refresh-token": REFRESH_TOKEN,
        },
      }
    )) as AxiosResponse<Cart>;
    handleNewToken(response);

    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error adding item to cart.";
    return errorMessage;
  }
};

export const removeItemFromCart = async (
  id: number,
  user_uuid: string,
  cartItem_id: number,
  quantity: number
): Promise<string | Cart> => {
  try {
    const response = (await axios.put(
      `${API_URL}/${id}`,
      {
        user_uuid: user_uuid,
        cartItem_id: cartItem_id,
        quantity: quantity,
      },
      {
        headers: {
          authorization: `Bearer ${TOKEN}`,
          "x-refresh-token": REFRESH_TOKEN,
        },
      }
    )) as AxiosResponse<Cart>;
    handleNewToken(response);
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error removing item from cart.";
    return errorMessage;
  }
};

export const deleteCartItem = async (
  cartItem_id: number,
  user_uuid: string,
  id: number
): Promise<string | Cart> => {
  try {
    const response = (await axios.delete(`${API_URL}/${cartItem_id}`, {
      headers: {
        authorization: `Bearer ${TOKEN}`,
        "x-refresh-token": REFRESH_TOKEN,
      },
      data: {
        user_uuid,
        id,
      },
    })) as AxiosResponse<Cart>;
    handleNewToken(response);
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error deleting cart item.";
    return errorMessage;
  }
};
