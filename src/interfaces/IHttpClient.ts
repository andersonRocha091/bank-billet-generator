export interface IHttpClient {
    post(url: string, data: any, headers?: Record<string, string>): Promise<any>;
    setAuthToken(token: string): void;
}