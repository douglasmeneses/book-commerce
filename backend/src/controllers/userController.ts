import { Request, Response } from 'express';
import userService from '../services/userService';
import axios from 'axios'; 
import bcrypt from 'bcryptjs'; 


const AUTH_SERVICE_URL = 'http://auth-service:3001/api/auth';
export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        error: 'Erro ao registrar email',
        message: 'Tente outro.',
      });
    }

    const existingUsername = await userService.getUserByUsername(username);
    if (existingUsername) {
      return res.status(400).json({
        error: 'Nome de usuário já registrado',
        message: 'Este nome de usuário já está em uso. Tente outro.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);  

    const newUser = await userService.registerUser(username, email, hashedPassword);
    return res.status(201).json({
      message: 'Usuário registrado com sucesso!',
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Erro ao registrar o usuário. Tente novamente mais tarde.',
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
        message: 'Não encontramos um usuário com esse email.',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Senha incorreta',
        message: 'A senha fornecida está incorreta.',
      });
    }

    const authResponse = await axios.post<{ token: string; error?: boolean }>(`${AUTH_SERVICE_URL}/login`, { email, password }); // URL do serviço externo de validação de Gabriel(modificar depois)

    if ((authResponse.data as { error: boolean }).error) {
      return res.status(500).json({
        error: 'Erro na autenticação',
        message: 'Erro ao autenticar. Tente novamente mais tarde.',
      });
    }

    return res.status(200).json({
      message: 'Login realizado com sucesso!',
      user: user,
      token: authResponse.data.token,  
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Erro ao tentar fazer o login. Tente novamente mais tarde.',
    });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  const { uuid } = req.params;
  const { token } = req.headers;

  try {
    const authResponse = await axios.post(
      `${AUTH_SERVICE_URL}/validate-token`, // URL do serviço externo de validação de Gabriel(modificar depois)
      { token }
    );

    const authData = authResponse.data as { error: boolean };
    if (authData.error) {
      return res.status(401).json({
        error: 'Token inválido',
        message: 'Token não autorizado. Faça login novamente.',
      });
    }

    
    const user = await userService.getUserByUUID(uuid);
    if (!user) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
        message: 'Não conseguimos encontrar o usuário com este ID.',
      });
    }

    return res.status(200).json({
      message: 'Perfil de usuário recuperado com sucesso!',
      user,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Erro ao tentar buscar o perfil do usuário.',
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { uuid } = req.params;
  const { token } = req.headers;

  try {
    const authResponse = await axios.post(
      `${AUTH_SERVICE_URL}/validate-token`,// URL do serviço externo de validação de Gabriel(modificar depois)
      { token }
    );

    const authData = authResponse.data as { error: boolean };
    if (authData.error) {
      return res.status(401).json({
        error: 'Token inválido',
        message: 'Token não autorizado. Faça login novamente.',
      });
    }

    const deletedUser = await userService.deleteUser(uuid);
    if (!deletedUser) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
        message: 'Não conseguimos encontrar o usuário para exclusão.',
      });
    }

    return res.status(204).json({
      message: 'Conta excluída com sucesso!',
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Ocorreu um erro ao tentar excluir sua conta. Tente novamente mais tarde.',
    });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const { uuid } = req.params;
  const { token } = req.headers;
  const { username, name, email, password, avatar, cpf, phone, address, birth_date } = req.body;

  try {
    const authResponse = await axios.post<{ error: boolean }>(
      `${AUTH_SERVICE_URL}/validate-token`, // URL do serviço externo de validação de Gabriel(modificar depois)
      { token }
    );

    if (authResponse.data.error) {
      return res.status(401).json({
        error: 'Token inválido',
        message: 'Token não autorizado. Faça login novamente.',
      });
    }

    const user = await userService.getUserByUUID(uuid);
    if (!user) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
        message: 'Não conseguimos encontrar o usuário para atualizar.',
      });
    }

    
    let updatedPassword = password;
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);  
    }

    const updatedUser = await userService.updateUserProfile(uuid, {
      username,
      name,
      birth_date,
      email,
      password: updatedPassword, 
      avatar,
      cpf,
      phone,
      address,
    });

    return res.status(200).json({
      message: 'Perfil atualizado com sucesso!',
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Ocorreu um erro ao tentar atualizar seu perfil. Tente novamente mais tarde.',
    });
  }
};
