import { makeRequest } from "../service";

export interface GetRequestResponse {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
    pedidos: {
      id_pedido: number;
      data_pedido: string;
      status: string;
      quantidade_total: number;
      valor_total: string;
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
      };
    }[];
  }
  

export interface GetRequestParams {
  limit?: number;
  page: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export const getRequest = async (
  params: GetRequestParams
): Promise<GetRequestResponse> => {
  try {
    const data = await makeRequest<GetRequestResponse>({
      url: "/pedido",
      method: "GET",
      params: params,
    });
    return data;
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
    throw error;
  }
};
