import { IHttpClient } from '../interfaces/IHttpClient';
import { IKobanaService } from '../interfaces/IKobanaService';



export class KobanaService implements IKobanaService {

    private client: IHttpClient;
    private clientId: string;
    private clientSecret: string;
    private baseUrl: string;
    constructor(client: IHttpClient, clientId: string, clientSecret: string, baseUrl: string) {
      
        this.client = client;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.baseUrl = baseUrl;
    }

    async getToken(): Promise<string> {

        const data = `grant_type=client_credentials&client_id=${this.clientId}&client_secret=${this.clientSecret}`;
        const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        const response = await this.client.post(`${this.baseUrl}/oauth2/token`, data, headers);
        return response.access_token;
        
    }
}