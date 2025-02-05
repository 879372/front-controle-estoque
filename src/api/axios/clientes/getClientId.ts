import { makeRequest } from "../service";


export interface GetClientIdResponse {
    id: string;
    name: string;
    username: string;
    additionalStandardGrossWeight: number;
    createdAt: string;
}

export const getClientId = async (id: string): Promise<GetClientIdResponse> => {
    try {
        const data = await makeRequest<GetClientIdResponse>({
            url: `/api/customers/list-id/${id}`,
            method: 'GET',
        });
        return data;
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        throw error;
    }
};
