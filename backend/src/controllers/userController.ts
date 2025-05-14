import userService from "../services/userService";
import { Request, Response } from "express";
import axios from "axios";
import bcrypt from "bcryptjs";
import { processAvatar } from "../utils/userUtils";

const AUTH_SERVICE_URL = "https://api-auth-4gd7.onrender.com/api/auth/";

const userController = {
  registerUser: async (req: Request, res: Response): Promise<Response> => {
    const { name, username, email, password, address } = req.body;

    try {
      const existingUser = await userService.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          error: "Erro ao registrar email",
          message: "Tente outro.",
        });
      }

      const existingUsername = await userService.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({
          error: "Nome de usuário já registrado",
          message: "Este nome de usuário já está em uso. Tente outro.",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await userService.registerUser({
        name,
        username,
        email,
        password: hashedPassword,
        address,
      });

      return res
        .status(201)
        .json({ message: "Usuário registrado com sucesso", user: newUser });
    } catch (error) {
      return res.status(400).json({
        error: error instanceof Error ? error.message : "Ocorreu um erro",
      });
    }
  },

  loginUser: async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;

    try {
      const user = await userService.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({
          error: "Usuário não encontrado",
          message: "Não encontramos um usuário com esse email.",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          error: "Senha incorreta",
          message: "A senha fornecida está incorreta.",
        });
      }

      try {
        const authResponse = await axios.post<{
          token: string;
          error?: boolean;
          refreshToken: string;
        }>(`${AUTH_SERVICE_URL}/login`, { email, password });

        if (authResponse.data.error) {
          return res.status(500).json({
            error: "Erro na autenticação",
            message: "Erro ao autenticar. Tente novamente mais tarde.",
          });
        }

        return res.status(200).json({
          message: "Login realizado com sucesso!",
          user: user,
          token: authResponse.data.token,
          refreshToken: authResponse.data.refreshToken,
        });
      } catch (authError) {
        console.error("Erro ao autenticar no serviço externo:", authError);
        return res.status(500).json({
          error: "Erro na autenticação externa",
          message:
            "Erro ao autenticar com o serviço externo. Tente novamente mais tarde.",
        });
      }
    } catch (error) {
      console.error("Erro ao tentar fazer login:", error);
      return res.status(500).json({
        error: "Erro interno do servidor",
        message: "Erro ao tentar fazer o login. Tente novamente mais tarde.",
      });
    }
  },
  getUserByUUID: async (req: Request, res: Response): Promise<Response> => {
    const uuid = req.params.uuid;

    try {
      const user = await userService.getUserByUUID(uuid);
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      return res.status(200).json({ user });
    } catch (error) {
      return res.status(400).json({
        error: error instanceof Error ? error.message : "Ocorreu um erro",
      });
    }
  },

  updateUserProfile: async (req: Request, res: Response): Promise<Response> => {
    const uuid = req.params.uuid;
    const { username, name, password, avatar, cpf, phone, birth_date } =
      req.body;
    if (birth_date && !/^\d{4}-\d{2}-\d{2}$/.test(birth_date)) {
      return res.status(400).json({
        error: "Data de nascimento inválida. O formato correto é YYYY-MM-DD.",
      });
    }

    try {
      const formattedBirthDate = birth_date ? new Date(birth_date) : undefined;
      const user = await userService.updateUserProfile(uuid, {
        username,
        name,
        password,
        avatar: avatar ? Buffer.from(avatar, "base64") : undefined,
        cpf,
        phone,
        birth_date: formattedBirthDate,
      });

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      return res
        .status(200)
        .json({ message: "Perfil atualizado com sucesso", user });
    } catch (error) {
      return res.status(400).json({
        error: error instanceof Error ? error.message : "Ocorreu um erro",
      });
    }
  },

  deleteUser: async (req: Request, res: Response): Promise<Response> => {
    const uuid = req.params.uuid;

    try {
      const deletedUser = await userService.deleteUser(uuid);
      if (!deletedUser) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      return res.status(200).json({ message: "Usuário excluído com sucesso" });
    } catch (error) {
      return res.status(400).json({
        error: error instanceof Error ? error.message : "Ocorreu um erro",
      });
    }
  },

  uploadAvatar: async (req: Request, res: Response): Promise<Response> => {
    try {
      const uuid = req.params.uuid;

      if (!req.file) {
        return res.status(400).json({ error: "Nenhuma imagem enviada" });
      }

      if (!req.file.mimetype.startsWith("image/")) {
        return res
          .status(400)
          .json({ error: "Arquivo enviado não é uma imagem válida" });
      }

      const response = await userService.uploadAvatar(uuid, req.file.buffer);
      if (response && "error" in response) {
        return res.status(400).json({ error: response.error });
      }

      if (!response) {
        return res.status(400).json({ error: "Erro ao atualizar avatar" });
      }

      const avatarBase64 = response.avatar
        ? await processAvatar(Buffer.from(response.avatar))
        : null;

      return res.status(200).json({
        message: "Avatar atualizado com sucesso!",
        user: { ...response, avatar: `data:image/png;base64,${avatarBase64}` },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      return res
        .status(500)
        .json({ error: `Erro ao fazer upload do avatar: ${errorMessage}` });
    }
  },
  getUserAddress: async (req: Request, res: Response): Promise<Response> => {
    const { uuid } = req.params;

    try {
      const address = await userService.getUserAddresses(uuid); // Verifique se o método 'getUserAddress' está funcionando corretamente
      if (!address) {
        return res.status(404).json({ message: "Endereço não encontrado" });
      }
      return res.status(200).json({ address });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  },
};

export default userController;
