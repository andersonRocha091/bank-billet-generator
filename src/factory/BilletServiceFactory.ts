import { HttpClient } from '../client/HttpClient'
import { KobanaService } from '../services/KobanaService';
import { FirestoreDataSaver } from '../utils/FirestoreDataSaver';
import { PubsubMessagePublisher } from '../utils/PubsubMessagePublisher';
import { CreateBilletUseCase } from '../usecases/CreateBilletUseCase';
import { GenerateBilletUseCase } from '../usecases/GenerateBilletUseCase';


interface IBilletService {
    createBillet(data: any): Promise<void>;
    generateBillet(): Promise<void>;
}

export class BilletServiceFactory {

    static createCreateBilletUseCase(): CreateBilletUseCase {
        const messagePublisher = new PubsubMessagePublisher('bank-billet-generator')
        const dataSaver = new FirestoreDataSaver('billets');
        return new CreateBilletUseCase(messagePublisher, dataSaver)
    }

    static createGenerateBilletUseCase(): GenerateBilletUseCase {
        const messagePublisher = new PubsubMessagePublisher('bank-billet-generator');
        const kobanaService = new KobanaService(
            new HttpClient(),
            process.env.KOBANA_CLIENT_ID ?? '',
            process.env.KOBANA_CLIENT_SECRET ?? '',
            process.env.KOBANA_API_URL ?? 'https://api-sandbox.kobana.com.br',
            process.env.KOBANA_AUTH_URL ?? 'https://app-sandbox.kobana.com.br'
        )

        return new GenerateBilletUseCase(kobanaService, messagePublisher);
    }
}