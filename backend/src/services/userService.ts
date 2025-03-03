import { PrismaClient } from '@prisma/client';  
import { UserRegisterDto } from '../dtos/userRegisterDto';  
import { UserLoginDto } from '../dtos/userLoginDto';
const prisma = new PrismaClient();  

export class UserService {  
  async register(userData: UserRegisterDto) {    
    const { email, password, username } = userData;  
    
    const user = await prisma.user.create({  
      data: {  
        email,  
        password,  
        username,  
        name: ''  
      },  
    });  
    return user;  
  }  

  async login(userData: UserLoginDto) {  
    const user = await prisma.user.findUnique({  
      where: {  
        email: userData.email,  
      },  
    });  

    if (user && user.password === userData.password) {  
      return user;  
    }  
    throw new Error('Invalid credentials');  
  }  

}  