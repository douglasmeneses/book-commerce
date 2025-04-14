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

  uploadAvatar: async (uuid: string, avatar: Buffer): Promise<User | null> => {
    const user = await prisma.user.update({
      where: { uuid },
      data: { avatar },
    });

    return user || null;
  },
  getUserAddresses: async (uuid: string): Promise<{
    is_default: boolean;
    label: string | null;
    address: {
      number: string;
      id: number;
      created_at: Date;
      updated_at: Date;
      street: string;
      neighborhood: string | null;
      complement: string | null;
      city: string;
      state: string;
      zip_code: string;
      country: string;
    };
  }[]> => {
    const user = await prisma.user.findUnique({
      where: { uuid },
      select: {
        addresses: {
          select: {
            is_default: true,
            label: true,
            address: {
              select: {
                number: true,
                id: true,
                created_at: true,
                updated_at: true,
                street: true,
                neighborhood: true,
                complement: true,
                city: true,
                state: true,
                zip_code: true,
                country: true,
              },
            },
          },
        },
      },
    });
  
    if (!user || !user.addresses) return [];
  
    return user.addresses.map((address) => ({
      is_default: address.is_default,
      label: address.label,
      address: address.address,
    }));
  }
  
};

export default userService;