import { makeRequest } from "../service";

export interface GetProductResponse {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
  produto: {
    id_produto: number;
    nome: string;
    descricao: string;
    preco: string;
    estoque: string;
    data_cadastro: string;
    data_validade: string;
  }[];
}

export interface GetProductParams {
  limit?: number;
  page: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export const getProducts = async (
  params: GetProductParams
): Promise<GetProductResponse> => {
  try {
    const data = await makeRequest<GetProductResponse>({
      url: "/produto",
      method: "GET",
      params: params,
    });
    return data;
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    throw error;
  }
};
