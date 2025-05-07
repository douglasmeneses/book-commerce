import { Request, Response, NextFunction } from "express";
import { authMiddleware } from "../auth";
import { verifyToken, refreshTokenRequest } from "../../utils/authUtils";

jest.mock("../../utils/authUtils");

describe("authMiddleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {} as Record<string, string | undefined>,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 401 if no token is provided", async () => {
    await authMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized: No token provided",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next if token is valid", async () => {
    req.headers = req.headers || {};
    req.headers.authorization = "Bearer validToken";
    (verifyToken as jest.Mock).mockResolvedValue(true);

    await authMiddleware(req as Request, res as Response, next);

    expect(verifyToken).toHaveBeenCalledWith("validToken");
    expect(next).toHaveBeenCalled();
  });

  it("should return 401 if token is invalid and no refresh token is provided", async () => {
    req.headers = req.headers || {};
    req.headers.authorization = "Bearer invalidToken";
    (verifyToken as jest.Mock).mockResolvedValue(false);

    await authMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized: No refresh token",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if refresh token fails to generate a new token", async () => {
    req.headers = req.headers || {};
    req.headers.authorization = "Bearer invalidToken";
    req.headers["x-refresh-token"] = "invalidRefreshToken";
    (verifyToken as jest.Mock).mockResolvedValue(false);
    (refreshTokenRequest as jest.Mock).mockResolvedValue(null);

    await authMiddleware(req as Request, res as Response, next);

    expect(refreshTokenRequest).toHaveBeenCalledWith("invalidRefreshToken");
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized: Refresh failed",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should set new token in header and call next if refresh token succeeds", async () => {
    req.headers = req.headers || {};
    req.headers.authorization = "Bearer invalidToken";
    req.headers["x-refresh-token"] = "validRefreshToken";
    (verifyToken as jest.Mock).mockResolvedValue(false);
    (refreshTokenRequest as jest.Mock).mockResolvedValue("newValidToken");

    await authMiddleware(req as Request, res as Response, next);

    expect(refreshTokenRequest).toHaveBeenCalledWith("validRefreshToken");
    expect(res.setHeader).toHaveBeenCalledWith(
      "Authorization",
      "Bearer newValidToken"
    );
    expect(next).toHaveBeenCalled();
  });
});
