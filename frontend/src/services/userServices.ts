import axios from "axios";
import { RegisterUser } from "@/types/userTypes";
import { cleanToken } from "@/utils/tokenUtils";

const API_URL = "https://backend-llyr.onrender.com/users";

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
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Error with request.");
    }
    throw new Error("Something went wrong with the request.");
  }
};

export const loginUser = async (email: string, password: string) => {
  const url = `${API_URL}/login`;
  const data = { email, password };
  try {
    return ApiRequest("post", url, data);
  } catch (error) {
    if (axios.isAxiosError(error))
      throw new Error(
        error.response?.data?.message || "Error while login user"
      );

    throw new Error("Something went wrong to login user");
  }
};

export const registerUser = async (newUser: RegisterUser) => {
  const url = `${API_URL}/register`;
  try {
    return ApiRequest("post", url, newUser);
  } catch (error) {
    if (axios.isAxiosError(error))
      throw new Error(
        error.response?.data?.message || "Error while registering user"
      );

    throw new Error("Something went wrong to register user");
  }
};

export const updateUserProfile = async (
  user_uuid: string,
  formData: FormData
) => {
  const url = `${API_URL}/${user_uuid}`;
  try {
    return ApiRequest("put", url, formData);
  } catch (error) {
    if (axios.isAxiosError(error))
      throw new Error(
        error.response?.data?.message || "Error while updating user profile"
      );

    throw new Error("Something went wrong to update user profile");
  }
};

export const deleteUser = async (user_uuid: string) => {
  const url = `${API_URL}/${user_uuid}`;
  try {
    return ApiRequest("delete", url);
  } catch (error) {
    if (axios.isAxiosError(error))
      throw new Error(
        error.response?.data?.message || "Error while deleting user"
      );

    throw new Error("Something went wrong to delete user");
  }
};

export const getUserAddress = async (user_uuid: string) => {
  const url = `${API_URL}/${user_uuid}/address`;
  try {
    return await ApiRequest("get", url);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Error while fetching user address"
      );
    }
    throw new Error("Something went wrong to fetch user address");
  }
};

export const getRecommendations = async (user_uuid: string) => {
  try {
    const url = `${API_URL}/recommendations/${user_uuid}`;
    const response = await ApiRequest("get", url);
    console.log("response", response);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Error while fetching recommendations"
      );
    }
    throw new Error("Something went wrong to fetch recommendations");
  }
};
