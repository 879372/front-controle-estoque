import { makeRequest } from "../service";


export interface GetUsersIdResponse {
    id_usuario: string;
    email: string;
    password: string;
}

export const getUserId = async (id: string): Promise<GetUsersIdResponse> => {
    try {
        const data = await makeRequest<GetUsersIdResponse>({
            url: `/usuario/${id}`,
            method: 'GET',
        });
        return data;
    } catch (error) {
        console.error('Erro ao buscar usuario:', error);
        throw error;
    }
};
