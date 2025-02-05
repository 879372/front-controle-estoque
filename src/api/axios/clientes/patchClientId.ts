import { makeRequest } from "../service";

export interface PatchClientsIdRequest {
    name: string;
    username: string;
    password: string;
    additionalStandardGrossWeight: number;
}

export const patchClientId = async (request: PatchClientsIdRequest, id: string) => {
    try {
        const data = await makeRequest({
            url: `/api/customers/update/${id}`,
            method: 'PATCH',
            data: request
        });
        return data;
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        throw error;
    }
};
