import axios from "axios";
import { cleanToken } from "../utils/tokenUtils";
import { handleNewToken } from "../utils/tokenUtils";

const API_URL = "http://localhost:3001/favorites";

const TOKEN = cleanToken(localStorage.getItem("token") || "");
const REFRESH_TOKEN = cleanToken(localStorage.getItem("refreshToken") || "");

export const favoriteBook = async (book_uuid: string, user_uuid: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/book/${book_uuid}`,
      {
        user_uuid: user_uuid,
      },
      {
        headers: {
          authorization: `Bearer ${TOKEN}`,
          "x-refresh-token": REFRESH_TOKEN,
        },
      }
    );
    handleNewToken(response);
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error favoriting book.";
    return errorMessage;
  }
};
