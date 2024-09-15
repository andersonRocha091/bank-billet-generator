import { BilletService } from '../services/BilletService';
import { HttpClient } from '../client/HttpClient'
import { KobanaService } from '../services/KobanaService';
import { FirestoreDataSaver } from '../utils/FirestoreDataSaver';
import { PubsubMessagePublisher } from '../utils/PubsubMessagePublisher';


interface IBilletService {
    createBillet(data: any): Promise<void>;
    generateBillet(): Promise<void>;
}

export class BilletServiceFactory {
    static create(): IBilletService {
        const messagePublisher = new PubsubMessagePublisher('bank-billet-generator');
        messagePublisher.setTopicName('billet-stream');
        const dataSaver = new FirestoreDataSaver('billets');
        const kobanaService = new KobanaService(
            new HttpClient(),
            process.env.KOBANA_CLIENT_ID ?? '',
            process.env.KOBANA_CLIENT_SECRET ?? '',
            process.env.KOBANA_API_URL ?? 'https://api-sandbox.kobana.com.br',
            process.env.KOBANA_AUTH_URL ?? 'https://app-sandbox.kobana.com.br'
        );
        const billetService = new BilletService(messagePublisher, dataSaver, kobanaService, messagePublisher);
        
        return billetService;
    }
}