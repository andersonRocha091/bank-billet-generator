import { IHttpClient } from '../interfaces/IHttpClient';
import { IBoletoService } from '../interfaces/IBoletoService';
import { BankBilletData } from '../validation/BankBilletData';



export class KobanaService implements IBoletoService{

    private client: IHttpClient;
    private clientId: string;
    private clientSecret: string;
    private baseUrl: string;
    private authBaseUrl: string;
    constructor(client: IHttpClient, clientId: string, clientSecret: string, baseUrl: string, authBaseUrl?: string) {
      
        this.client = client;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.baseUrl = baseUrl;
        this.authBaseUrl = authBaseUrl ?? '';
    }

    async getToken(): Promise<string> {
        const data = `grant_type=client_credentials&client_id=${this.clientId}&client_secret=${this.clientSecret}&scope=write`;
        const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        const response = await this.client.post(`${this.authBaseUrl}/oauth/token`, data, headers);
        return response.access_token;
        
    }

    async createBillet(data: BankBilletData, token: string): Promise<any> {

        try {

            data.validate();
            this.client.setAuthToken(token);
            const response = await this.client.post(`${this.baseUrl}/v1/bank_billets`, data.getData());
            console.log('RESPONSE: ', response);
            return response;

        } catch (error) {
            console.log('ERROR RESQUEST: ', JSON.stringify(error));
            throw new Error(`Error creating billet: ${error}`);
        }

    }
}