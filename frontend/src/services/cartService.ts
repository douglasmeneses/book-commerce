import { Cart } from "@/types/cartTypes";
import axios, { AxiosResponse } from "axios";
import { use } from "react";

const API_URL = "http://localhost:3001/carts";
const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImplZmZzb25AZ21haWwuY29tIiwiaWF0IjoxNzQzMzgxOTU3LCJleHAiOjE3NDMzODU1NTd9.Qd9ce0og5unoK_a9jO2IvgEaBSYNITAYLr3Z5h5zEG0";

const REFRESH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImplZmZzb25AZ21haWwuY29tIiwiaWF0IjoxNzQzMzgxOTU3LCJleHAiOjE3NDM0NjgzNTd9.MUrpMzRhgjYHBlWJOiGX2Vhd-QCBRNB1K--J8TCJx3A";
export const getCart = async (user_uuid: string): Promise<string | Cart> => {
  try {
    const response = await axios.get(`${API_URL}/${user_uuid}`, {
      headers: {
        authorization: `Bearer ${TOKEN}`,
        "x-refresh-token": REFRESH_TOKEN,
      },
    });
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
    const reponse = (await axios.post(
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

    return reponse.data;
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
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error deleting cart item.";
    return errorMessage;
  }
};
