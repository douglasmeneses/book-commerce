import { Cart } from "@/types/cartTypes";
import axios, { AxiosResponse } from "axios";
import { cleanToken, handleNewToken } from "@/utils/tokenUtils";

const API_URL = "http://localhost:3001/carts/user";

const TOKEN = cleanToken(localStorage.getItem("token") || "");
const REFRESH_TOKEN = cleanToken(localStorage.getItem("refreshToken") || "");

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
      `${API_URL}/${user_uuid}/item/${book_uuid}`,
      {
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
  user_uuid: string,
  cartItem_id: number,
  quantity: number
): Promise<string | Cart> => {
  try {
    const response = (await axios.put(
      //"/user/:user_uuid/item/:cartItem_id/remove"
      `${API_URL}/${user_uuid}/item/${cartItem_id}/remove`,
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
  user_uuid: string
): Promise<string | Cart> => {
  try {
    const response = (await axios.delete(
      `${API_URL}/${user_uuid}/item/${cartItem_id}`,
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
      error instanceof Error ? error.message : "Error deleting cart item.";
    return errorMessage;
  }
};
