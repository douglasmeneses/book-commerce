import userService from "../userService";
import { PrismaClient, User } from "@prisma/client";
import { RegisterUser, UpdateUser } from "../../types/userTypes";

jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

const newUser: RegisterUser = {
  email: "newuser@example.com",
  username: "newuser",
  password: "password123",
  name: "New User",
  address: {
    street: "123 Main St",
    number: "456",
    neighborhood: "Downtown",
    city: "Cityville",
    state: "ST",
    zip_code: "12345-678",
    country: "Countryland",
  },
};
const mockUser = {
  id: 1,
  uuid: "1234-5678",
  email: "test@example.com",
  username: "testuser",
  avatar: null,
  created_at: new Date(),
  updated_at: new Date(),
};
describe("userService.getUserByUUID", () => {
  it("Deve retornar um usuário existente", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const result = await userService.getUserByUUID("1234-5678");

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { uuid: "1234-5678" },
    });
    expect(result).toEqual(mockUser);
  });

  it("Deve retornar null se o usuário não existir", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await userService.getUserByUUID("non-existent-uuid");

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { uuid: "non-existent-uuid" },
    });
    expect(result).toBeNull();
  });
});

describe("userService.getUserByEmail", () => {
  it("Deve retornar um usuário existente", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const result = await userService.getUserByEmail("test@example.com");

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
    });
    expect(result).toEqual(mockUser);
  });

  it("Deve retornar null se o usuário não existir", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await userService.getUserByEmail("non-existent@example.com");

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "non-existent@example.com" },
    });
    expect(result).toBeNull();
  });
});

describe("userService.registerUser", () => {
  it("Deve registrar um novo usuário", async () => {
    (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

    const result = await userService.registerUser(newUser);

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: { ...newUser },
    });
    expect(result).toEqual(mockUser);
  });

  it("Deve lançar um erro ao falhar no registro", async () => {
    (prisma.user.create as jest.Mock).mockResolvedValue(null);

    await expect(userService.registerUser(newUser)).rejects.toThrow(
      "Erro ao registrar usuário"
    );
  });
});
describe("userService.deleteUser", () => {
  it("Deve deletar um usuário existente e retornar os dados do usuário deletado", async () => {
    (prisma.user.delete as jest.Mock).mockResolvedValue(mockUser);

    const result = await userService.deleteUser("1234-5678");

    expect(prisma.user.delete).toHaveBeenCalledWith({
      where: { uuid: "1234-5678" },
    });
    expect(result).toEqual(mockUser);
  });

  it("Deve retornar null se o usuário não existir", async () => {
    (prisma.user.delete as jest.Mock).mockResolvedValue(null);

    const result = await userService.deleteUser("non-existent-uuid");

    expect(prisma.user.delete).toHaveBeenCalledWith({
      where: { uuid: "non-existent-uuid" },
    });
    expect(result).toBeNull();
  });
});
describe("userService.updateUserProfile", () => {
  const updatedUser: UpdateUser = {
    username: "updateduser",
    name: "Updated User",
    password: "newpassword123",
  };

  it("Deve atualizar o perfil de um usuário existente e retornar os dados atualizados", async () => {
    (prisma.user.update as jest.Mock).mockResolvedValue({
      ...mockUser,
      ...updatedUser,
    });

    const result = await userService.updateUserProfile(
      "1234-5678",
      updatedUser
    );

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { uuid: "1234-5678" },
      data: { ...updatedUser },
    });
    expect(result).toEqual({ ...mockUser, ...updatedUser });
  });

  it("Deve retornar null se o usuário não existir", async () => {
    (prisma.user.update as jest.Mock).mockResolvedValue(null);

    const result = await userService.updateUserProfile(
      "non-existent-uuid",
      updatedUser
    );

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { uuid: "non-existent-uuid" },
      data: { ...updatedUser },
    });
    expect(result).toBeNull();
  });
});
describe("userService.uploadAvatar", () => {
  const mockAvatar = Buffer.from("mock-avatar-data");

  it("Deve atualizar o avatar de um usuário existente e retornar os dados atualizados", async () => {
    (prisma.user.update as jest.Mock).mockResolvedValue({
      ...mockUser,
      avatar: mockAvatar,
    });

    const result = await userService.uploadAvatar("1234-5678", mockAvatar);

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { uuid: "1234-5678" },
      data: { avatar: mockAvatar },
    });
    expect(result).toEqual({ ...mockUser, avatar: mockAvatar });
  });

  it("Deve retornar null se o usuário não existir", async () => {
    (prisma.user.update as jest.Mock).mockResolvedValue(null);

    const result = await userService.uploadAvatar(
      "non-existent-uuid",
      mockAvatar
    );

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { uuid: "non-existent-uuid" },
      data: { avatar: mockAvatar },
    });
    expect(result).toBeNull();
  });
});

describe("userService.getUserAddresses", () => {
  const mockAddresses = [
    {
      is_default: true,
      label: "Home",
      address: {
        number: "123",
        id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        street: "Main St",
        neighborhood: "Downtown",
        complement: "Apt 4B",
        city: "Cityville",
        state: "ST",
        zip_code: "12345-678",
        country: "Countryland",
      },
    },
    {
      is_default: false,
      label: "Work",
      address: {
        number: "456",
        id: 2,
        created_at: new Date(),
        updated_at: new Date(),
        street: "Second St",
        neighborhood: "Uptown",
        complement: null,
        city: "Cityville",
        state: "ST",
        zip_code: "98765-432",
        country: "Countryland",
      },
    },
  ];

  it("Deve retornar os endereços de um usuário existente", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      addresses: mockAddresses,
    });

    const result = await userService.getUserAddresses("1234-5678");

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { uuid: "1234-5678" },
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
    expect(result).toEqual(mockAddresses);
  });

  it("Deve retornar uma lista vazia se o usuário não existir", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await userService.getUserAddresses("non-existent-uuid");

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { uuid: "non-existent-uuid" },
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
    expect(result).toEqual([]);
  });

  it("Deve retornar uma lista vazia se o usuário não tiver endereços", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      addresses: [],
    });

    const result = await userService.getUserAddresses("1234-5678");

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { uuid: "1234-5678" },
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
    expect(result).toEqual([]);
  });
});
