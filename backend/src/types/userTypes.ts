import { User } from "@prisma/client";
export interface RegisterUser {
  name: string;
  username: string;
  email: string;
  password: string;
  birth_date?: Date;
  cpf?: string;
  phone?: string;
}

export interface UpdateUser {
  name?: string;
  username?: string;
  password?: string;
  avatar?: Buffer;
  birth_date?: Date;
  cpf?: string;
  phone?: string;
}

export interface ProcessedUser extends Omit<User, "avatar"> {
  avatar: string | null;
}