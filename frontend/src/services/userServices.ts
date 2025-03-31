import axios from "axios";

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
