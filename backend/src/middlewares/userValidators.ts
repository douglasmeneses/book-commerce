import { PrismaClient } from "@prisma/client";
import validator from "validator";
import userService from "../services/userService";

const prisma = new PrismaClient();

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
};
