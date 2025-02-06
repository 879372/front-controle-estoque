import { makeRequest } from "../service";

export const deleteClientId = async (id: string) => {
    try {
        const data = await makeRequest({
            url: `/clientes/${id}`,
            method: 'DELETE',
        });
        return data;
    } catch (error) {
        console.error('Erro ao apagar cliente:', error);
        throw error;
    }
};
