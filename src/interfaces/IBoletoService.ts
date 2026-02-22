import { RegisteredBillet } from "../domain/RegisteredBillet";
import { BankBillet } from '../domain/BankBillet';

export interface IBoletoService {
    getToken(): Promise<string>;
    createBillet(data: BankBillet, token: string | undefined): Promise<RegisteredBillet>;
}