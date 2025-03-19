import axios from "axios";
import { Request, Response, NextFunction } from "express";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];
  const refreshToken = req.headers["x-refresh-token"];

  const AUTH_SERVICE_URL = "http://localhost:3002/api/auth";

  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  interface TokenResponse {
    token: string;
  }

  try {
    const response = await axios.post<TokenResponse>(
      `${AUTH_SERVICE_URL}/verify-token/`,
      { token }
    );

    if (response.status !== 200) {
      res.status(401).json({ message: "Unauthorized: Invalid token" });
      return;
    }

    return next();
  } catch (err: any) {
    console.log("Token inválido, tentando refresh...");

    if (!refreshToken) {
      res.status(401).json({ message: "Unauthorized: No refresh token" });
      return;
    }

    try {
      const refreshResponse = await axios.post<TokenResponse>(
        `${AUTH_SERVICE_URL}/refresh-token/`,
        { token: refreshToken }
      );

      if (refreshResponse.status !== 200) {
        res.status(401).json({ message: "Unauthorized: Refresh failed" });
        return;
      }

      res.setHeader("Authorization", `Bearer ${refreshResponse.data.token}`);

      return next();
    } catch (refreshErr) {
      console.error("Erro ao renovar token:", refreshErr);
      res.status(401).json({ message: "Unauthorized: Refresh failed" });
      return;
    }
  }
};
