import axios from "axios";
import { verifyToken, refreshTokenRequest } from "../authUtils";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("authUtils", () => {
  const AUTH_SERVICE_URL = "http://localhost:3002/api/auth";

  describe("verifyToken", () => {
    it("should return true if the token is valid", async () => {
      mockedAxios.post.mockResolvedValueOnce({
        status: 200,
        data: { valid: true },
        statusText: "OK",
        headers: {},
        config: {
          url: `${AUTH_SERVICE_URL}/verify-token/`,
        },
      });

      const result = await verifyToken("valid-token");

      expect(result).toBe(true);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${AUTH_SERVICE_URL}/verify-token/`,
        { token: "valid-token" }
      );
    });

    it("should return false if the token is invalid", async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error("Invalid token"));

      const result = await verifyToken("invalid-token");

      expect(result).toBe(false);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${AUTH_SERVICE_URL}/verify-token/`,
        { token: "invalid-token" }
      );
    });
  });

  describe("refreshTokenRequest", () => {
    it("should return a new token if the refresh token is valid", async () => {
      mockedAxios.post.mockResolvedValueOnce({
        status: 200,
        data: { token: "new-token" },
        statusText: "OK",
        headers: {},
        config: {
          url: `${AUTH_SERVICE_URL}/verify-token/`,
        },
      });

      const result = await refreshTokenRequest("valid-refresh-token");

      expect(result).toBe("new-token");
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${AUTH_SERVICE_URL}/refresh-token/`,
        { token: "valid-refresh-token" }
      );
    });

    it("should return null if the refresh token is invalid", async () => {
      mockedAxios.post.mockRejectedValueOnce(
        new Error("Invalid refresh token")
      );

      const result = await refreshTokenRequest("invalid-refresh-token");

      expect(result).toBeNull();
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${AUTH_SERVICE_URL}/refresh-token/`,
        { token: "invalid-refresh-token" }
      );
    });
  });
});
