import { makeRequest } from "../service";


export interface GetClientIdResponse {
    id_cliente: number;
    nome: string;
    email: string;
    telefone: string;
    endereco: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    data_cadastro: string;
}

export const getClientId = async (id: string): Promise<GetClientIdResponse> => {
    try {
        const data = await makeRequest<GetClientIdResponse>({
            url: `/clientes/${id}`,
            method: 'GET',
        });
        return data;
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        throw error;
    }
};
