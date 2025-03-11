import { User } from "@prisma/client";
import { error } from "../types/bookTypes";
import userService from "../services/userService";

export const userExists = async (uuid: string): Promise<User | error> => {
  if (!uuid || typeof uuid !== "string") {
    return { error: "User ID is required" };
  }
  const user = await userService.getUserByUUID(uuid);
  if (!user) {
    return { error: "User not found" };
  }
  return user;
};

export const validUser = async (uuid: string) => {
  if (!uuid || typeof uuid !== "string") {
    return { error: "User ID is required" };
  }
  const user = await userService.getUserByUUID(uuid);
  if (!user) {
    return { error: "User not found" };
  }
  if (!user.isAdmin) {
    return { error: "User Unauthorized" };
  }
  return;
};
