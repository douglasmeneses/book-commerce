import axios from "axios";
import { Request, Response, NextFunction } from "express";
import { verifyToken, refreshTokenRequest } from "../utils/authUtils";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];
  const refreshToken = req.headers["x-refresh-token"] as string | undefined;

  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  if (await verifyToken(token)) {
    return next();
  }

  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized: No refresh token" });
    return;
  }

  const newToken = await refreshTokenRequest(refreshToken);

  if (!newToken) {
    res.status(401).json({ message: "Unauthorized: Refresh failed" });
    return;
  }

  res.setHeader("Authorization", `Bearer ${newToken}`);
  next();
};
