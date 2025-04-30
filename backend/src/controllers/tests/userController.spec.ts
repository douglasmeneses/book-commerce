import userController from "../userController";
import userService from "../../services/userService";
import { mockRequest, mockResponse } from "./__utils__/index";
import bcrypt from "bcryptjs";
import axios from "axios";

jest.mock("../../services/userService", () => ({
  __esModule: true,
  default: {
    getUserByEmail: jest.fn(),
    getUserByUsername: jest.fn(),
    registerUser: jest.fn(),
    getUserByUUID: jest.fn(),
    updateUserProfile: jest.fn(),
    deleteUser: jest.fn(),
    uploadAvatar: jest.fn(),
    getUserAddresses: jest.fn(),
  },
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("axios");
jest.mock("../../utils/userUtils", () => ({
  __esModule: true,
  processAvatar: jest.fn(),
}));

describe("userController.registerUser", () => {
  it("deve registrar um usuário com sucesso", async () => {
    const req = mockRequest({
      body: {
        name: "John Doe",
        username: "johndoe",
        email: "john@example.com",
        password: "password123",
        address: "123 Main St",
      },
    });
    const res = mockResponse();

    (userService.getUserByEmail as jest.Mock).mockResolvedValue(null);
    (userService.getUserByUsername as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
    (userService.registerUser as jest.Mock).mockResolvedValue({
      id: 1,
      name: "John Doe",
      username: "johndoe",
      email: "john@example.com",
    });

    await userController.registerUser(req, res);

    expect(userService.getUserByEmail).toHaveBeenCalledWith("john@example.com");
    expect(userService.getUserByUsername).toHaveBeenCalledWith("johndoe");
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    expect(userService.registerUser).toHaveBeenCalledWith({
      name: "John Doe",
      username: "johndoe",
      email: "john@example.com",
      password: "hashedPassword",
      address: "123 Main St",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Usuário registrado com sucesso",
      user: expect.objectContaining({
        name: "John Doe",
        username: "johndoe",
        email: "john@example.com",
      }),
    });
  });

  it("deve retornar erro se o email já estiver registrado", async () => {
    const req = mockRequest({
      body: {
        name: "John Doe",
        username: "johndoe",
        email: "john@example.com",
        password: "password123",
        address: "123 Main St",
      },
    });
    const res = mockResponse();

    (userService.getUserByEmail as jest.Mock).mockResolvedValue({ id: 1 });

    await userController.registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Erro ao registrar email",
      message: "Tente outro.",
    });
  });

  it("deve retornar erro se o username já estiver registrado", async () => {
    const req = mockRequest({
      body: {
        name: "John Doe",
        username: "johndoe",
        email: "john@example.com",
        password: "password123",
        address: "123 Main St",
      },
    });
    const res = mockResponse();

    (userService.getUserByEmail as jest.Mock).mockResolvedValue(null);
    (userService.getUserByUsername as jest.Mock).mockResolvedValue({ id: 1 });

    await userController.registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Nome de usuário já registrado",
      message: "Este nome de usuário já está em uso. Tente outro.",
    });
  });

  it("deve lidar com erros internos", async () => {
    const req = mockRequest({
      body: {
        name: "John Doe",
        username: "johndoe",
        email: "john@example.com",
        password: "password123",
        address: "123 Main St",
      },
    });
    const res = mockResponse();

    (userService.getUserByEmail as jest.Mock).mockRejectedValue(
      new Error("Erro interno")
    );

    await userController.registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Erro interno",
    });
  });
});

describe("userController.loginUser", () => {
  it("deve realizar login com sucesso", async () => {
    const req = mockRequest({
      body: {
        email: "john@example.com",
        password: "password123",
      },
    });
    const res = mockResponse();

    const userMock = {
      id: 1,
      email: "john@example.com",
      password: "hashedPassword",
    };

    (userService.getUserByEmail as jest.Mock).mockResolvedValue(userMock);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (axios.post as jest.Mock).mockResolvedValue({
      data: {
        token: "token123",
        refreshToken: "refreshToken123",
      },
    });

    await userController.loginUser(req, res);

    expect(userService.getUserByEmail).toHaveBeenCalledWith("john@example.com");
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "password123",
      "hashedPassword"
    );
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:3002/api/auth/login",
      { email: "john@example.com", password: "password123" }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Login realizado com sucesso!",
      user: userMock,
      token: "token123",
      refreshToken: "refreshToken123",
    });
  });

  it("deve retornar erro se o email não for encontrado", async () => {
    const req = mockRequest({
      body: {
        email: "john@example.com",
        password: "password123",
      },
    });
    const res = mockResponse();

    (userService.getUserByEmail as jest.Mock).mockResolvedValue(null);

    await userController.loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Usuário não encontrado",
      message: "Não encontramos um usuário com esse email.",
    });
  });

  it("deve retornar erro se a senha estiver incorreta", async () => {
    const req = mockRequest({
      body: {
        email: "john@example.com",
        password: "password123",
      },
    });
    const res = mockResponse();

    const userMock = {
      id: 1,
      email: "john@example.com",
      password: "hashedPassword",
    };

    (userService.getUserByEmail as jest.Mock).mockResolvedValue(userMock);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await userController.loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Senha incorreta",
      message: "A senha fornecida está incorreta.",
    });
  });
});
describe("userController.getUserByUUID", () => {
  it("deve retornar o usuário com sucesso", async () => {
    const req = mockRequest({ params: { uuid: "1234" } });
    const res = mockResponse();

    const userMock = { id: 1, uuid: "1234", name: "John Doe" };
    (userService.getUserByUUID as jest.Mock).mockResolvedValue(userMock);

    await userController.getUserByUUID(req, res);

    expect(userService.getUserByUUID).toHaveBeenCalledWith("1234");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ user: userMock });
  });

  it("deve retornar erro se o usuário não for encontrado", async () => {
    const req = mockRequest({ params: { uuid: "1234" } });
    const res = mockResponse();

    (userService.getUserByUUID as jest.Mock).mockResolvedValue(null);

    await userController.getUserByUUID(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Usuário não encontrado" });
  });

  it("deve lidar com erros internos", async () => {
    const req = mockRequest({ params: { uuid: "1234" } });
    const res = mockResponse();

    (userService.getUserByUUID as jest.Mock).mockRejectedValue(
      new Error("Erro interno")
    );

    await userController.getUserByUUID(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro interno" });
  });
});

describe("userController.updateUserProfile", () => {
  it("deve atualizar o perfil do usuário com sucesso", async () => {
    const req = mockRequest({
      params: { uuid: "1234" },
      body: {
        username: "johndoe",
        name: "John Doe",
        password: "password123",
        avatar: "base64avatar",
        cpf: "12345678901",
        phone: "123456789",
        birth_date: "2000-01-01",
      },
    });
    const res = mockResponse();

    const updatedUserMock = { id: 1, uuid: "1234", name: "John Doe" };
    (userService.updateUserProfile as jest.Mock).mockResolvedValue(
      updatedUserMock
    );

    await userController.updateUserProfile(req, res);

    expect(userService.updateUserProfile).toHaveBeenCalledWith("1234", {
      username: "johndoe",
      name: "John Doe",
      password: "password123",
      avatar: Buffer.from("base64avatar", "base64"),
      cpf: "12345678901",
      phone: "123456789",
      birth_date: new Date("2000-01-01"),
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Perfil atualizado com sucesso",
      user: updatedUserMock,
    });
  });

  it("deve retornar erro se a data de nascimento for inválida", async () => {
    const req = mockRequest({
      params: { uuid: "1234" },
      body: { birth_date: "01-01-2000" },
    });
    const res = mockResponse();

    await userController.updateUserProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Data de nascimento inválida. O formato correto é YYYY-MM-DD.",
    });
  });

  it("deve retornar erro se o usuário não for encontrado", async () => {
    const req = mockRequest({ params: { uuid: "1234" }, body: {} });
    const res = mockResponse();

    (userService.updateUserProfile as jest.Mock).mockResolvedValue(null);

    await userController.updateUserProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Usuário não encontrado" });
  });

  it("deve lidar com erros internos", async () => {
    const req = mockRequest({ params: { uuid: "1234" }, body: {} });
    const res = mockResponse();

    (userService.updateUserProfile as jest.Mock).mockRejectedValue(
      new Error("Erro interno")
    );

    await userController.updateUserProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro interno" });
  });
});

describe("userController.deleteUser", () => {
  it("deve excluir o usuário com sucesso", async () => {
    const req = mockRequest({ params: { uuid: "1234" } });
    const res = mockResponse();

    (userService.deleteUser as jest.Mock).mockResolvedValue(true);

    await userController.deleteUser(req, res);

    expect(userService.deleteUser).toHaveBeenCalledWith("1234");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Usuário excluído com sucesso",
    });
  });

  it("deve retornar erro se o usuário não for encontrado", async () => {
    const req = mockRequest({ params: { uuid: "1234" } });
    const res = mockResponse();

    (userService.deleteUser as jest.Mock).mockResolvedValue(false);

    await userController.deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Usuário não encontrado" });
  });

  it("deve lidar com erros internos", async () => {
    const req = mockRequest({ params: { uuid: "1234" } });
    const res = mockResponse();

    (userService.deleteUser as jest.Mock).mockRejectedValue(
      new Error("Erro interno")
    );

    await userController.deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro interno" });
  });
});
