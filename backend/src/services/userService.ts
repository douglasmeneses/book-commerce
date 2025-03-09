import { PrismaClient, User } from "@prisma/client";

const users = new PrismaClient().user;

const userService = {
  getUserByUUID: async (uuid: string): Promise<User | null> => {
    const user = await users.findUnique({
      where: {
        uuid: uuid,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  },
};

export default userService;
