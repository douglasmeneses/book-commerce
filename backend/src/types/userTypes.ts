export interface RegisterUser {
  name: string;
  username: string;
  email: string;
  password: string;
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
