import { makeRequest } from "../service";

export interface PatchPasswordUserIdRequest {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export const patchPasswordUserId = async (request: PatchPasswordUserIdRequest, id: string) => {
    try {
        const data = await makeRequest({
            url: `/api/users/update-password/${id}`,
            method: 'PATCH',
            data: request
        });
        return data;
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        throw error;
    }
};
