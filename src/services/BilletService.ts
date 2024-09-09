import { IMessagePublisher } from '../interfaces/IMessagePublisher';
import { IDataSaver } from '../interfaces/IDataSaver';
import { IKobanaService } from '../interfaces/IKobanaService'

import { PubsubMessagePublisher } from '../utils/PubsubMessagePublisher';
export class BilletService {
    
    private readonly messagePublisher: IMessagePublisher;
    private readonly dataSaver: IDataSaver<any>;
    private readonly kobanaService?: IKobanaService;
    private readonly pubSubMessager?: PubsubMessagePublisher;
    constructor(messagePublisher: IMessagePublisher, dataSaver: IDataSaver<any>, 
                kobanaService?: IKobanaService, pubSubMessager?: PubsubMessagePublisher) {
        this.messagePublisher = messagePublisher;
        this.dataSaver = dataSaver;
        this.kobanaService = kobanaService;
        this.pubSubMessager = pubSubMessager;
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

    async generateBillet(): Promise<void> {
        console.log('ENTERED GENERATE BILLET METHOD');
        try {
            const subscription = await this.pubSubMessager?.subscribeToTopic('billet-stream');
            subscription?.on('message', async (message) => {
                const messageId = message.id;
                const messageData = this.parseMessageData(message.data);

                try {
                    const token = await this.kobanaService?.getToken();
                    console.log(`TOKEN: ${token}`);
                    console.log(`MESSAGE PAYLOAD: ${JSON.stringify(messageData)}`);
                    console.log(`ACK MESSAGE ID: ${messageId}`);
                    message.ack();
                } catch (error) {
                    console.error('Error on processing a message', error);
                    message.nack();
                }
            });

        } catch (error) {

            console.error('Error generating Billet');
            
        }
    }

    private parseMessageData(data: any) {
        
        if(Buffer.isBuffer(data)) {
            return JSON.parse(data.toString('utf-8'));
        } else if(typeof data === 'string') {
            return JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
        } else if (data && typeof data === 'object') {
            return data;
        } else {
            throw new Error('Invalid data format');
        }
    }
}