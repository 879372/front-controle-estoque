import { makeRequest } from "../service";


export interface GetUsersIdResponse {
    id: string;
    username: string;
    type: string;
    createdAt: string;
}

export const getUserId = async (id: string): Promise<GetUsersIdResponse> => {
    try {
        const data = await makeRequest<GetUsersIdResponse>({
            url: `/api/users/list-id/${id}`,
            method: 'GET',
        });
        return data;
    } catch (error) {
        console.error('Erro ao buscar usuario:', error);
        throw error;
    }
};
