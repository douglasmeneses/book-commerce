import { AxiosResponse } from "axios";

export const cleanToken = (token: string): string =>
  token.replace(/^"|"$/g, "");

export const handleNewToken = (response: AxiosResponse<any, any>): void => {
  const authHeader = response.headers["authorization"] as string | undefined;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    localStorage.setItem("token", cleanToken(authHeader));
  }
};
