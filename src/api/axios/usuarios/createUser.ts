import { makeRequest } from "../service";

export interface CreateUser {
  username: string;
  type: string;
  password: string;
}

export interface CreateUserResponse {
  user: {
    id: string;
    username: string;
    type: string;
    createdAt: string;
  };
  access_token: string;
}

export const createUser = async (dadosUser: CreateUser): Promise<CreateUserResponse> => {
  try {
    const data = await makeRequest<CreateUserResponse>({
      url: '/api/users/create',
      method: 'POST',
      data: dadosUser,
    });
    return data; 
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error; 
  }
};
