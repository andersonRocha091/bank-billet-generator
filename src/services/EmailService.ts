import { IEmailService } from "../interfaces/IEmailService";
import { PubsubMessagePublisher } from "../utils/PubsubMessagePublisher";
import { Message } from '@google-cloud/pubsub';

interface EmailData {
    email: string;
    billetUrl: string;
}

interface MessageData {
    data: EmailData;
}

export class EmailService {

    private messagePublisher: PubsubMessagePublisher;
    private emailProviderService: IEmailService;
    constructor(messagePublisher: PubsubMessagePublisher, emailProviderService: IEmailService) {
        this.messagePublisher = messagePublisher;
        this.emailProviderService = emailProviderService;
    }


    async start() {

        const subscription = await this.messagePublisher.subscribeToTopic('email-sender');

        subscription?.on('message', async (message: Message) => {
            const messageid = message.id;
            try {
                const messageData = this.parseMessageData(message.data);
                console.log('PARSED MESSAGE: ', messageData);
                await this.emailProviderService.sendEmail(messageData.data.email, 'Billet Generated', `Billet URL: ${messageData.data.billetUrl}`);
                message.ack();
            } catch (error) {
                console.error('ERROR SENDING EMAIL: ', error);
                message.ack();
            }
        })
    }

    parseMessageData(data: any): MessageData {
        if (Buffer.isBuffer(data)) {
            return JSON.parse(data.toString('utf-8'));
        } else if (typeof data === 'string') {
            return JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
        } else if (data && typeof data === 'object') {
            return data;
        } else {
            throw new Error('Invalid data format');
        }
    }

}