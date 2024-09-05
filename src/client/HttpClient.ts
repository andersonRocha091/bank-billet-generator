
import axios, { AxiosInstance } from 'axios';
import { IHttpClient } from '../interfaces/IHttpClient';

export class HttpClient implements IHttpClient {

    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create();
    }

    async post(url: string, data: any, headers?: Record<string, string>): Promise<any> {
        const response = await this.axiosInstance.post(url, data, { headers });
        return response.data;
    }
}