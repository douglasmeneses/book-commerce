import { Cart } from "@/types/cartTypes";
import axios, { AxiosResponse } from "axios";
import { use } from "react";

const API_URL = "http://localhost:3001/carts";
const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImplZmZzb25AZ21haWwuY29tIiwiaWF0IjoxNzQzMjA5NDM5LCJleHAiOjE3NDMyMTMwMzl9.QJPiwTEabFRcvMnKbmvCGTH_d9dhk7zBHpvRd3Wyecw";
const REFRESH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImplZmZzb25AZ21haWwuY29tIiwiaWF0IjoxNzQzMjA5NDM5LCJleHAiOjE3NDMyOTU4Mzl9.rVgG0HuYy59u7htI_WmMlKaSi65izTAutd434X4E0og";

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
        user_uuid,
        cartItem_id,
        quantity,
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
