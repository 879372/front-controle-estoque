import { makeRequest } from "../service";

export interface CreateClient {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export const createClient = async (dadosClient: CreateClient) => {
  try {
    const data = await makeRequest({
      url: '/clientes',
      method: 'POST',
      data: dadosClient,
    });
    return data;
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    throw error;
  }
};
