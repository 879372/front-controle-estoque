import { makeRequest } from "../service";

export interface GetClientResponse {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
  clientes: {
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
  }[];
}

export interface GetClientParams {
  limit?: number;
  page: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export const getClients = async (
  params: GetClientParams
): Promise<GetClientResponse> => {
  try {
    const data = await makeRequest<GetClientResponse>({
      url: "/clientes",
      method: "GET",
      params: params,
    });
    return data;
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    throw error;
  }
};
