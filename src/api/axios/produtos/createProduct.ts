import { makeRequest } from "../service";

export interface CreateProduct {
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  data_validade: string;
}

export const createProduct = async (dadosProduct: CreateProduct) => {
  try {
    const data = await makeRequest({
      url: '/produto',
      method: 'POST',
      data: dadosProduct,
    });
    return data;
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    throw error;
  }
};
