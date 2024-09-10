
import axios, { AxiosInstance } from 'axios';
import { IHttpClient } from '../interfaces/IHttpClient';

export class HttpClient implements IHttpClient {

    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create();
    }

    setAuthToken(token: string): void {
        this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    async post(url: string, data: any, headers?: Record<string, string>): Promise<any> {
        const response = await this.axiosInstance.post(url, data, { headers });
        return response.data;
    }
}