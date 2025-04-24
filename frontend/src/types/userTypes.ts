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
  name: string;
  username?: string;
  password?: string;
  phone?: string;
  cpf?: string;
  birth_date?: Date;
}

export interface User {
  uuid: string;
  id: number;
  email: string;
  password: string;
  name: string;
  username: string;
  avatar: string | null;
  birth_date: Date | null;
  cpf: string | null;
  phone: string | null;
  isAdmin: boolean;
  created_at: string;
  updated_at: string;
  address?: Address;
}


export interface Address {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  complement: string | null;
}