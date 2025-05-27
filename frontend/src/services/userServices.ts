import axios from "axios";
import { RegisterUser, UpdateUser } from "@/types/userTypes";
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
  updatedData: UpdateUser
) => {
  const url = `${API_URL}/${user_uuid}`;
  try {
    await ApiRequest("put", url, updatedData);
    const updatedUser = await getUserByUuid(user_uuid);

    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    if (JSON.stringify(parsedUser) !== JSON.stringify(updatedUser)) {
      localStorage.setItem("user", JSON.stringify(updatedUser.user));
    }

    return updatedUser;
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

export const getUserByUuid = async (user_uuid: string) => {
  const url = `${API_URL}/${user_uuid}`;
  try {
    return ApiRequest("get", url);
  } catch (error) {
    if (axios.isAxiosError(error))
      throw new Error(
        error.response?.data?.message || "Error while fetching user"
      );

    throw new Error("Something went wrong to fetch user");
  }
};

export const uploadUserAvatar = async (user_uuid: string, avatar: File) => {
  const url = `${API_URL}/${user_uuid}/upload`;

  const formData = new FormData();
  formData.append("avatar", avatar);

  console.log("Avatar being uploaded:", formData.get("avatar"));

  try {
    return ApiRequest("put", url, formData);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Erro ao fazer upload do avatar"
      );
    }
    throw new Error("Algo deu errado ao fazer upload do avatar");
  }
};
