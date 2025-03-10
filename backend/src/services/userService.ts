import { PrismaClient, User } from "@prisma/client";

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
};

export default userService;
