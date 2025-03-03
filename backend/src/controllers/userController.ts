import { Request, Response } from 'express';  
import { UserService } from '../services/UserService';  
import { UserRegisterDto } from '../dtos/userRegisterDto';  
import { UserLoginDto } from '../dtos/userLoginDto';

const userService = new UserService();  

export class UserController {  
  async register(req: Request, res: Response) {  
    try {  
      const userData: UserRegisterDto = req.body;  
      const user = await userService.register(userData);  
      res.status(201).json(user);  
    } catch (error) {  
      res.status(400).json( {error: "Todos os campos (email, password e username) são obrigatórios." });  
    }  
  }  

  async login(req: Request, res: Response) {  
    try {  
      const userData: UserLoginDto = req.body;  
      const user = await userService.login(userData);  
      res.status(200).json(user);  
    } catch (error) {  
      res.status(401).json({ error: "Usuário ou senha incorretos" });  
    }  
  }  

 
}  