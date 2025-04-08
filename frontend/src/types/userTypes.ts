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
