import axios from "axios";
import { cleanToken, handleNewToken } from "../utils/tokenUtils";

const API_URL = "https://backend-llyr.onrender.com";

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

export const getReviewsByBook = async (book_uuid: string) => {
  const url = `${API_URL}/reviews/${book_uuid}`;
  const response = await ApiRequest("get", url);
  return response.length === 0 ? [] : response;
};

export const createReview = async (
  book_uuid: string,
  user_uuid: string,
  review: string,
  rating: number
) => {
  const url = `${API_URL}/reviews/${book_uuid}`;
  const data = { user_uuid, review, rating };
  return ApiRequest("post", url, data);
};

export const updateReview = async (
  review_uuid: string,
  review: string,
  rating: number
) => {
  const url = `${API_URL}/reviews/${review_uuid}`;
  const data = { review, rating };
  return ApiRequest("put", url, data);
};

export const deleteReview = async (review_uuid: string) => {
  const url = `${API_URL}/reviews/${review_uuid}`;
  return ApiRequest("delete", url);
};
