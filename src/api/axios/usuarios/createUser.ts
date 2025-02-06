import { makeRequest } from "../service";

export interface CreateUser {
  email: string;
  password: string;
}

export interface CreateUserResponse {
  id_usuario: string;
  email: string;
  password: string;
}

export const createUser = async (dadosUser: CreateUser): Promise<CreateUserResponse> => {
  try {
    const data = await makeRequest<CreateUserResponse>({
      url: '/usuario',
      method: 'POST',
      data: dadosUser,
    });
    return data; 
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error; 
  }
};
