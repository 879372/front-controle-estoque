import { makeRequest } from "../service";

export interface PatchClientsIdRequest {
    nome: string;
    email: string;
    telefone: string;
    endereco: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
}

export const patchClientId = async (request: PatchClientsIdRequest, id: string) => {
    try {
        const data = await makeRequest({
            url: `/clientes/${id}`,
            method: 'PATCH',
            data: request
        });
        return data;
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        throw error;
    }
};
