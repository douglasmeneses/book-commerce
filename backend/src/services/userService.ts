import { PrismaClient, User } from "@prisma/client";

const users = new PrismaClient().user;

const userService = {
  getUserById: async (id: number): Promise<User | null> => {
    const user = await users.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  },
};

export default userService;
