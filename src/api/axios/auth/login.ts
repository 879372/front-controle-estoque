import axios from "axios";
import { makeRequest } from "../service";
const API_BASE_URL = process.env.NEXT_PUBLIC_URL
export interface LoginBody {
    email: string;
    password: string;
}

interface UserResponse {
    acessToken: string;
}

export const AuthLogin = async (body: LoginBody): Promise<UserResponse> => {
  try {
    const data = await makeRequest<UserResponse>({
      url: '/auth',
      method: 'POST',
      data: body,
    });
    return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.data.error === 'jwt expired') {
                throw new Error('Token inválido');
            } else if (error.response?.data.message) {
                throw new Error(error.response.data.message);
            }
        }
    }
    throw new Error('Tente novamente mais tarde!');
}