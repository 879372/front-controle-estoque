import api from "./core";

interface AxiosRequestProps {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'; 
    params?: Record<string, any>; 
    data?: Record<string, any>;
    headers?: Record<string, string>;
  }
  
  export async function makeRequest<T>({
    url,
    method,
    params,
    data,
    headers,
  }: AxiosRequestProps): Promise<T> {
    try {
      const response = await api.request<T>({
        url,
        method,
        params,
        data,
        headers,
      });
      return response.data;
    } catch (error: any) {
      if(error.response.data.message === 'Token inválido' || error.response.data.message === "jwt expired"){
        window.location.href = '/';
      };
      console.log(error.response || error);
      throw error.response?.data || error;
    }
  }
  