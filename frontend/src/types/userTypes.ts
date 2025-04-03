export interface RegisterUser {
  name: string;
  username: string;
  email: string;
  password: string;
  birth_date?: Date;
  cpf?: string;
  phone?: string;
}