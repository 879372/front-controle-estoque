import { makeRequest } from "../service";


export interface GetProductIdResponse {
    id_produto: number;
    nome: string;
    descricao: string;
    preco: string;
    estoque: string;
    data_cadastro: string;
    data_validade: string;
}

export const getProductId = async (id: string): Promise<GetProductIdResponse> => {
    try {
        const data = await makeRequest<GetProductIdResponse>({
            url: `/produto/${id}`,
            method: 'GET',
        });
        return data;
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        throw error;
    }
};
