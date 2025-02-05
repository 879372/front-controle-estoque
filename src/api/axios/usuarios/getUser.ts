import { makeRequest } from "../service";


export interface GetUsersResponse {
  page: number;   
  limit: number;      
  totalItens: number;
  totalPages: number;   
  users: {
    id: string;
    username: string;
    type: string;
    createdAt: string;
}[];                 
}

export interface GetUserParams {
    limit?: number;
    role?: string;
    page: number;
    search?: string;
    dateStart: string;
    dateEnd: string;
}

export const getUsers = async (params: GetUserParams): Promise<GetUsersResponse> => {
    try {
        const data = await makeRequest<GetUsersResponse>({
            url: '/api/users/list-all',
            method: 'GET',
            params: params,
        });
        return data;
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        throw error;
    }
};
