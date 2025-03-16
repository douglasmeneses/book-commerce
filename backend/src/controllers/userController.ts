import { Request, Response } from "express";
import userService from "../services/userService";
import axios from "axios";
import bcrypt from "bcryptjs";


const AUTH_SERVICE_URL = "http://localhost:3002/api/auth";


export const registerUser = async (req: Request, res: Response) => {
  const { name, username, email, password } = req.body;

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
    });

    return res.status(201).json({
      message: "Usuário registrado com sucesso!",
      user: newUser,
    });
  } catch (error) {
    console.error("Erro ao registrar o usuário:", error);
    return res.status(500).json({
      error: "Erro interno do servidor",
      message: "Erro ao registrar o usuário. Tente novamente mais tarde.",
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
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
      const authResponse = await axios.post<{ token: string; error?: boolean }>(
        `${AUTH_SERVICE_URL}/login`,
        { email, password }
      );

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
};
export const getUserProfile = async (req: Request, res: Response) => {
  const { uuid } = req.params;

  try {
    const user = await userService.getUserByUUID(uuid);
    if (!user) {
      return res.status(404).json({
        error: "Usuário não encontrado",
        message: "Não conseguimos encontrar o usuário com este ID.",
      });
    }

    return res.status(200).json({
      message: "Perfil de usuário recuperado com sucesso!",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Erro interno do servidor",
      message: "Erro ao tentar buscar o perfil do usuário.",
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { uuid } = req.params;

  try {
    const deletedUser = await userService.deleteUser(uuid);
    if (!deletedUser) {
      return res.status(404).json({
        error: "Usuário não encontrado",
        message: "Não conseguimos encontrar o usuário para exclusão.",
      });
    }

    return res.status(204).json({
      message: "Conta excluída com sucesso!",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Erro interno do servidor",
      message:
        "Ocorreu um erro ao tentar excluir sua conta. Tente novamente mais tarde.",
    });
  }
};

export const updateUserProfile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { uuid } = req.params;
  const { username, name, password, avatar, cpf, phone, birth_date } =
    req.body;

  try {
    if (!uuid) {
      return res.status(400).json({
        error: "UUID não fornecido",
        message: "O UUID do usuário deve ser fornecido na URL.",
      });
    }

    const user = await userService.updateUserProfile(uuid, {
      username,
      name,
      password,
      avatar: avatar ? Buffer.from(avatar, "base64") : undefined, 
      cpf,
      phone,
      birth_date,
    });
    if (!user) {
      return res.status(404).json({
        error: "Usuário não encontrado",
        message: "Não conseguimos encontrar o usuário para atualizar.",
      });
    }

   
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }


    return res.status(200).json({
      message: "Perfil atualizado com sucesso!",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erro interno do servidor",
      message:
        "Ocorreu um erro ao tentar atualizar seu perfil. Tente novamente mais tarde.",
    });
  }
};
