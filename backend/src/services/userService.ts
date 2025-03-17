import { PrismaClient, User } from "@prisma/client";
import { RegisterUser, UpdateUser } from "../types/userTypes";

const prisma = new PrismaClient();

const userService = {
  getUserByUUID: async (uuid: string): Promise<User | null> => {
    const user = await prisma.user.findUnique({
      where: {
        uuid: uuid,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  },

  getUserByEmail: async (email: string): Promise<User | null> => {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  },

  getUserByUsername: async (username: string): Promise<User | null> => {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  },

  registerUser: async (user: RegisterUser): Promise<User> => {
    const newUser = await prisma.user.create({
      data: {
        ...user,
      },
    });

    if (!newUser) {
      throw new Error("Erro ao registrar usuário");
    }

    return newUser;
  },

  deleteUser: async (uuid: string): Promise<User | null> => {
    const user = await prisma.user.delete({
      where: {
        uuid: uuid,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  },

  updateUserProfile: async (
    uuid: string,
    updateUser: UpdateUser
  ): Promise<User | null> => {
    const user = await prisma.user.update({
      where: {
        uuid: uuid,
      },
      data: {
        ...updateUser,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  },
};

export default userService;
