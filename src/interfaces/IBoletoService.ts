import { BankBilletData } from "../validation/BankBilletData";

export interface IBoletoService {
    getToken(): Promise<string>;
    createBillet(data: BankBilletData, token: string | undefined): Promise<any>;
}