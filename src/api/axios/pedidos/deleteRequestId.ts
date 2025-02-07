import { makeRequest } from "../service";

export const deleteRequestId = async (id: string) => {
    try {
        const data = await makeRequest({
            url: `/pedido/${id}`,
            method: 'DELETE',
        });
        return data;
    } catch (error) {
        console.error('Erro ao apagar pedido:', error);
        throw error;
    }
};
