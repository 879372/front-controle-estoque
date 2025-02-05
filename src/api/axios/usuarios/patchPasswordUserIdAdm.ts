import { makeRequest } from "../service";

export interface PatchPasswordUserIdAdmRequest {
    newPassword: string;
    confirmPassword: string;
}

export const patchPasswordUserIdAdm = async (request: PatchPasswordUserIdAdmRequest, id: string) => {
    try {
        const data = await makeRequest({
            url: `/api/users/update-password-adm/${id}`,
            method: 'PATCH',
            data: request
        });
        return data;
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        throw error;
    }
};
