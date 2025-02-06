import { makeRequest } from "../service";

export const deleteProductId = async (id: string) => {
    try {
        const data = await makeRequest({
            url: `/produto/${id}`,
            method: 'DELETE',
        });
        return data;
    } catch (error) {
        console.error('Erro ao apagar produto:', error);
        throw error;
    }
};
