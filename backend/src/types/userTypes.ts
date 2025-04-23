import { User } from "@prisma/client";

export interface Address {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  complement?: string;
}

export interface RegisterUser {
  name: string;
  username: string;
  email: string;
  password: string;
  birth_date?: Date;
  cpf?: string;
  phone?: string;
  address: Address;
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