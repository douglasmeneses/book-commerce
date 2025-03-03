export interface User {
    uuid: string;
    id: number;
    email: string;
    password: string;
    username: string;
    name?: string;
    avatar?: Buffer;
    birth_date?: Date;
    cpf?: string;
    phone?: string;
    isAdmin: boolean;
    created_at: Date;
  }