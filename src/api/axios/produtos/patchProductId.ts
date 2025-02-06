import { makeRequest } from "../service";

export interface PatchProductIdRequest {
    nome: string;
    descricao: string;
    preco: number;
    estoque: number;
    data_validade: string;
}

export const patchProductId = async (request: PatchProductIdRequest, id: string) => {
    try {
        const data = await makeRequest({
            url: `/produto/${id}`,
            method: 'PATCH',
            data: request
        });
        return data;
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        throw error;
    }
};
