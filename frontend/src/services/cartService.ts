import { Cart } from "@/types/cartTypes";
import axios, { AxiosResponse } from "axios";

const API_URL = "http://localhost:3001/carts";
const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIxQGdtYWlsLmNvbSIsImlhdCI6MTc0MzM3MDgwMiwiZXhwIjoxNzQzMzc0NDAyfQ.zOgikeaCABb-miDChY_tCQOtXw21BBJVu8CadMU8Ci8";
const REFRESH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIxQGdtYWlsLmNvbSIsImlhdCI6MTc0MzM3MDgwMiwiZXhwIjoxNzQzNDU3MjAyfQ.wPgCEllb8Kyn5AM8wG7enUuL3u9qmVryC8AZwIGylQs";

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

    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error adding item to cart.";
    return errorMessage;
  }
};
