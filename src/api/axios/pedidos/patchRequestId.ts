import { makeRequest } from "../service";

export interface PatchRequestIdRequest {
    status: string;
}

export const patchRequestId = async (request: PatchRequestIdRequest, id: string) => {
    try {
        const data = await makeRequest({
            url: `/pedido/${id}`,
            method: 'PATCH',
            data: request
        });
        return data;
    } catch (error) {
        console.error('Erro ao atualizar pedido:', error);
        throw error;
    }
};
