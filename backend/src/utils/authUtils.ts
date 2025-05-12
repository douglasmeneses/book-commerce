import axios from "axios";

const AUTH_SERVICE_URL = "https://api-auth-4gd7.onrender.com/api/auth";

interface TokenResponse {
  token: string;
}

export const verifyToken = async (token: string): Promise<boolean> => {
  try {
    const response = await axios.post<TokenResponse>(
      `${AUTH_SERVICE_URL}/verify-token/`,
      { token }
    );
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export const refreshTokenRequest = async (
  refreshToken: string
): Promise<string | null> => {
  try {
    const response = await axios.post<TokenResponse>(
      `${AUTH_SERVICE_URL}/refresh-token/`,
      { token: refreshToken }
    );
    return response.status === 200 ? response.data.token : null;
  } catch (error) {
    return null;
  }
};
