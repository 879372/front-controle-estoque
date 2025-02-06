import { makeRequest } from "../service";


export interface GetUsersResponse {
  page: number;   
  limit: number;      
  totalRecords: number;
  totalPages: number;   
  usuarios: {
    id_usuario: string;
    email: string;
    password: string;
}[];                 
}

export interface GetUserParams {
    limit: number;
    page: number;
    status: string;
    search: string;
    startDate: string;
    endDate: string;
}

export const getUsers = async (params: GetUserParams): Promise<GetUsersResponse> => {
    try {
        const data = await makeRequest<GetUsersResponse>({
            url: '/usuario',
            method: 'GET',
            params: params,
        });
        return data;
    } catch (error) {
        console.error('Erro ao buscar usuarios:', error);
        throw error;
    }
};
