import { makeRequest } from "../service";


export interface GetRequestIdResponse {
    id_pedido: number;
    data_pedido: string;
    status: string;
    quantidade_total: number;
    valor_total: string;
    itensPedido: {
        id_item_pedido: number;
        preco_unitario: string;
        quantidade: string;
        produto: {
            descricao: string;
            id_produto: string;
        }
    }[]
    cliente: {
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
}

export const getRequestId = async (id: string): Promise<GetRequestIdResponse> => {
    try {
        const data = await makeRequest<GetRequestIdResponse>({
            url: `/pedido/${id}`,
            method: 'GET',
        });
        return data;
    } catch (error) {
        console.error('Erro ao criar pedido:', error);
        throw error;
    }
};
