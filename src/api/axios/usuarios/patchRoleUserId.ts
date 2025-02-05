import { makeRequest } from "../service";

export interface PatchRoleUsersIdRequest {
    role: string;
}

export const patchRoleUserId = async (request: PatchRoleUsersIdRequest, id: string) => {
    try {
        const data = await makeRequest({
            url: `/api/users/update-role/${id}`,
            method: 'PATCH',
            params:request
        });
        return data;
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        throw error;
    }
};
