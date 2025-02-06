import { makeRequest } from "../service";

export interface PatchUsersIdRequest {
    email: string;
    password: string;
}

export const patchUserId = async (request: PatchUsersIdRequest, id: string) => {
    try {
        const data = await makeRequest({
            url: `/usuario/${id}`,
            method: 'PATCH',
            data: request
        });
        return data;
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        throw error;
    }
};
