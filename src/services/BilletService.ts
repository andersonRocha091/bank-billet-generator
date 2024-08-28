import { IMessagePublisher } from '../interfaces/IMessagePublisher';
import { IDataSaver } from '../interfaces/IDataSaver';
export class BilletService {
    private readonly messagePublisher: IMessagePublisher;
    private readonly dataSaver: IDataSaver<any>;
    constructor(messagePublisher: IMessagePublisher, dataSaver: IDataSaver<any>) {
        this.messagePublisher = messagePublisher;
        this.dataSaver = dataSaver;
    }

    async createBillet(invoiceData: any): Promise<void> {
        
        try {
            const docId = await this.dataSaver.saveData(invoiceData);
            const message = JSON.stringify({message: 'Billet created',docId: docId, billetData: invoiceData});
            const messageId = await this.messagePublisher.publishMessage(message);
        } catch (error: any) {
            console.log(`Error creating billet: ${error.message}`);
        }
    }
}