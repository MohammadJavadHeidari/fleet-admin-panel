import type { AxiosRequestConfig } from 'axios';
import type { IBaseResponse } from 'src/types/api-client';

import axios from './axios';

export class apiClient {
  static async get<T>(url: string, config: AxiosRequestConfig = {}) {
    const response = await axios.get<IBaseResponse<T>>(`${url}`, { ...config });
    return response.data;
  }

  static async post<T>(url: string, data = {}, config: AxiosRequestConfig = {}) {
    const response = await axios.post<T>(`${url}`, data, { ...config });
    return response.data;
  }

  static async patch<T>(url: string, data = {}, config: AxiosRequestConfig = {}) {
    const response = await axios.patch<T>(`${url}`, data, { ...config });
    return response.data;
  }

  static async delete<T>(url: string, config: AxiosRequestConfig = {}) {
    const response = await axios.delete<T>(`${url}`, { ...config });
    return response.data;
  }
}
