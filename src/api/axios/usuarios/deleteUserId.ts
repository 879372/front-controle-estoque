import { makeRequest } from "../service";

export const deleteUserId = async (id: string) => {
    try {
        const data = await makeRequest({
            url: `/usuario/${id}`,
            method: 'DELETE',
        });
        return data;
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        throw error;
    }
};
