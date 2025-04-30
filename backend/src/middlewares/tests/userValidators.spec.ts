import { userExists, validUser } from "../userValidators";
import userService from "../../services/userService";

jest.mock("../../services/userService");

describe("userValidators", () => {
  describe("userExists", () => {
    it("should return an error if uuid is not provided", async () => {
      const result = await userExists("");
      expect(result).toEqual({ error: "User ID is required" });
    });

    it("should return an error if uuid is not a string", async () => {
      const result = await userExists(123 as any);
      expect(result).toEqual({ error: "User ID is required" });
    });

    it("should return an error if user is not found", async () => {
      (userService.getUserByUUID as jest.Mock).mockResolvedValue(null);
      const result = await userExists("non-existent-uuid");
      expect(result).toEqual({ error: "User not found" });
    });

    it("should return the user if found", async () => {
      const mockUser = { id: "1", name: "John Doe" };
      (userService.getUserByUUID as jest.Mock).mockResolvedValue(mockUser);
      const result = await userExists("valid-uuid");
      expect(result).toEqual(mockUser);
    });
  });

  describe("validUser", () => {
    it("should return an error if uuid is not provided", async () => {
      const result = await validUser("");
      expect(result).toEqual({ error: "User ID is required" });
    });

    it("should return an error if uuid is not a string", async () => {
      const result = await validUser(123 as any);
      expect(result).toEqual({ error: "User ID is required" });
    });

    it("should return an error if user is not found", async () => {
      (userService.getUserByUUID as jest.Mock).mockResolvedValue(null);
      const result = await validUser("non-existent-uuid");
      expect(result).toEqual({ error: "User not found" });
    });

    it("should return an error if user is not an admin", async () => {
      const mockUser = { id: "1", name: "John Doe", isAdmin: false };
      (userService.getUserByUUID as jest.Mock).mockResolvedValue(mockUser);
      const result = await validUser("valid-uuid");
      expect(result).toEqual({ error: "User Unauthorized" });
    });

    it("should return undefined if user is an admin", async () => {
      const mockUser = { id: "1", name: "John Doe", isAdmin: true };
      (userService.getUserByUUID as jest.Mock).mockResolvedValue(mockUser);
      const result = await validUser("valid-uuid");
      expect(result).toBeUndefined();
    });
  });
});
