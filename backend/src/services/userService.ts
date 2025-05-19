import { PrismaClient, User } from "@prisma/client";
import { RegisterUser, UpdateUser } from "../types/userTypes";
import { z } from "zod";

const prisma = new PrismaClient();

// Validation schemas
const uuidSchema = z.string().uuid();
const emailSchema = z.string().email();
const usernameSchema = z.string().min(3).max(50);

const registerUserSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
  password: z.string().min(6),
  name: z.string().min(2),
});

const updateUserSchema = z.object({
  email: emailSchema.optional(),
  username: usernameSchema.optional(),
  name: z.string().min(2).optional(),
});

const userService = {
  getUserByUUID: async (uuid: string): Promise<User | null> => {
    // Validate UUID
    const validation = uuidSchema.safeParse(uuid);
    if (!validation.success) {
      throw new Error("Invalid UUID format");
    }

    const user = await prisma.user.findUnique({
      where: {
        uuid: uuid,
      },
      include: {
        addresses: {
          include: {
            address: true,
          }
        },
        favorites: {
          include: {
            book: true,
          }
        },
        reviews: true,
        orders: true
      }
    });

    if (!user) {
      return null;
    }

    return user;
  },

  getUserByEmail: async (email: string): Promise<User | null> => {
    // Validate email
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      throw new Error("Invalid email format");
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        addresses: {
          include: {
            address: true,
          }
        },
      }
    });

    if (!user) {
      return null;
    }

    return user;
  },

  getUserByUsername: async (username: string): Promise<User | null> => {
    // Validate username
    const validation = usernameSchema.safeParse(username);
    if (!validation.success) {
      throw new Error("Invalid username format");
    }

    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
      include: {
        addresses: {
          include: {
            address: true,
          }
        },
      }
    });

    if (!user) {
      return null;
    }

    return user;
  },

  registerUser: async (user: RegisterUser): Promise<User> => {
    // Validate registration data
    const validation = registerUserSchema.safeParse(user);
    if (!validation.success) {
      throw new Error(`Validation error: ${validation.error.message}`);
    }

    // Check if email or username already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: user.email },
          { username: user.username }
        ]
      }
    });

    if (existingUser) {
      throw new Error("Email or username already exists");
    }

    const newUser = await prisma.user.create({
      data: {
        ...user,
      },
      include: {
        addresses: {
          include: {
            address: true,
          }
        },
      }
    });

    if (!newUser) {
      throw new Error("Error registering user");
    }

    return newUser;
  },

  deleteUser: async (uuid: string): Promise<User | null> => {
    // Validate UUID
    const validation = uuidSchema.safeParse(uuid);
    if (!validation.success) {
      throw new Error("Invalid UUID format");
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { uuid }
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    const user = await prisma.user.delete({
      where: {
        uuid: uuid,
      },
      include: {
        addresses: {
          include: {
            address: true,
          }
        },
      }
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
    // Validate UUID
    const uuidValidation = uuidSchema.safeParse(uuid);
    if (!uuidValidation.success) {
      throw new Error("Invalid UUID format");
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { uuid }
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    // If email or username is being updated, check for uniqueness
    if (updateUser.username) {
      const duplicateUser = await prisma.user.findFirst({
        where: {
          AND: [
            { uuid: { not: uuid } },
            { username: updateUser.username }
          ]
        }
      });

      if (duplicateUser) {
        throw new Error("Username already exists");
      }
    }

    // Update user profile
    const user = await prisma.user.update({
      where: {
        uuid: uuid,
      },
      data: {
        ...updateUser,
      },
      include: {
        addresses: {
          include: {
            address: true,
          }
        },
        favorites: {
          include: {
            book: true,
          }
        },
        reviews: true,
      }
    });

    if (!user) {
      throw new Error("Error updating user profile");
    }

    return user;
  },

  uploadAvatar: async (uuid: string, avatar: Buffer): Promise<User | null> => {
    // Validate UUID
    const validation = uuidSchema.safeParse(uuid);
    if (!validation.success) {
      throw new Error("Invalid UUID format");
    }

    // Validate avatar buffer
    if (!avatar || !(avatar instanceof Buffer)) {
      throw new Error("Invalid avatar format");
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { uuid }
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    const user = await prisma.user.update({
      where: { uuid },
      data: { avatar },
      include: {
        addresses: {
          include: {
            address: true,
          }
        },
      }
    });

    return user;
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