import { makeRequest } from "../service";

export interface CreateRequest {
  clienteId: Number;
  status: string;
  itensPedido: {
    produtoId: number;
    quantidade: number;
  }[];
}

export const createRequest = async (dataRequest: CreateRequest) => {
  try {
    const data = await makeRequest({
      url: '/pedido',
      method: 'POST',
      data: dataRequest,
    });
    return data;
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    throw error;
  }
};
