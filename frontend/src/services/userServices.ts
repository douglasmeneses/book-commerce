import axios from "axios";
import { RegisterUser, Address } from "@/types/userTypes";

const API_URL = "http://localhost:3001/users";

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Error while login user"
      );
    }
    throw new Error("Something went wrong to login user");
  }
};

export const registerUser = async (newUser: RegisterUser) => {
  try {
    const response = await axios.post(`${API_URL}/register`, newUser);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Error while register user"
      );
    }
    throw new Error("Something went wrong to register user");
  }
};

export const updateUserProfile = async (
  user_uuid: string,
  formData: FormData
) => {
  try {
    const TOKEN = localStorage.getItem("token") || "";
    const REFRESH_TOKEN = localStorage.getItem("refresh_token") || "";
    const response = await axios.put(`${API_URL}/${user_uuid}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        authorization: `Bearer ${TOKEN}`,
        "x-refresh-token": REFRESH_TOKEN,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Error while updating user profile"
      );
    }
    throw new Error("Something went wrong to update user profile");
  }
};

export const deleteUser = async (user_uuid: string) => {
  try {
    const TOKEN = localStorage.getItem("token") || "";
    const REFRESH_TOKEN = localStorage.getItem("refresh_token") || "";
    const response = await axios.delete(`${API_URL}/${user_uuid}`, {
      headers: {
        authorization: `Bearer ${TOKEN}`,
        "x-refresh-token": REFRESH_TOKEN,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Error while deleting user"
      );
    }
    throw new Error("Something went wrong to delete user");
  }
};


export const getUserAddress = async (user_uuid: string) => {
  try {
    const TOKEN = localStorage.getItem("token") || "";
    const REFRESH_TOKEN = localStorage.getItem("refresh_token") || "";
    const response = await axios.get(`${API_URL}/${user_uuid}/address`, {
      headers: {
        authorization: `Bearer ${TOKEN}`,
        "x-refresh-token": REFRESH_TOKEN,
      },
    });
    return response.data;  
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Error while fetching user address"
      );
    }
    throw new Error("Something went wrong to fetch user address");
  }
};