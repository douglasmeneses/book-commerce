import axios from "axios";
import { RegisterUser } from "@/types/userTypes";

const API_URL = "http://localhost:3001/users";

const TOKEN = localStorage.getItem("token") || "";
const REFRESH_TOKEN = localStorage.getItem("refresh_token") || "";

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

    const response = await axios[method](url, data, tokenConfig);
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
