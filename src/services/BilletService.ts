import { IMessagePublisher } from '../interfaces/IMessagePublisher';
import { IDataSaver } from '../interfaces/IDataSaver';
import { IBoletoService } from '../interfaces/IBoletoService'
import { BankBilletData } from '../validation/BankBilletData';

import { PubsubMessagePublisher } from '../utils/PubsubMessagePublisher';
export class BilletService {
    
    private readonly messagePublisher: IMessagePublisher;
    private readonly dataSaver: IDataSaver<any>;
    private readonly kobanaService?: IBoletoService;
    private readonly pubSubMessager?: PubsubMessagePublisher;
    constructor(messagePublisher: IMessagePublisher, dataSaver: IDataSaver<any>, 
                kobanaService?: IBoletoService, pubSubMessager?: PubsubMessagePublisher) {
        this.messagePublisher = messagePublisher;
        this.dataSaver = dataSaver;
        this.kobanaService = kobanaService;
        this.pubSubMessager = pubSubMessager;
    }

    async createBillet(invoiceData: any): Promise<void> {
        
        try {
            const billetData = new BankBilletData({
                amount: invoiceData.amount,
                expire_at: invoiceData.expire_at,
                customer_person_name: invoiceData.customer_person_name,
                customer_cnpj_cpf: invoiceData.customer_cnpj_cpf,
                customer_state: invoiceData.customer_state,
                customer_city_name: invoiceData.customer_city_name,
                customer_zipcode: invoiceData.customer_zipcode,
                customer_address: invoiceData.customer_address,
                customer_neighborhood: invoiceData.customer_neighborhood,
                customer_email: invoiceData.customer_email,
                interest_type: invoiceData.interest_type,
                interest_days_type: invoiceData.interest_days_type,
                fine_type: invoiceData.fine_type,
                discount_type: invoiceData.discount_type,
                charge_type: invoiceData.charge_type,
                dispatch_type: invoiceData.dispatch_type,
                document_type: invoiceData.document_type,
                document_number:invoiceData.document_number,
                acceptance: invoiceData.acceptance,
                pix_txid: null,
                prevent_pix: invoiceData.prevent_pix,
                recipient_account: invoiceData.recipient_account,
                reduction_amount: invoiceData.reduction_amount,
                instructions_mode: invoiceData.instructions_mode,
                payment_count: invoiceData.payment_count
            });
            
            billetData.validate();
            console.log('Billet data validated');
            const docId = await this.dataSaver.saveData({...invoiceData, billet: billetData.getData()});
            const message = JSON.stringify({message: 'Billet created',docId: docId, billetData: billetData.getData()});
            this.messagePublisher.setTopicName('billet-stream');
            const messageId = await this.messagePublisher.publishMessage(message, 'billet-stream');
        } catch (error: any) {
            console.log(`Error creating billet: ${error.message}`);
        }
    }

    async generateBillet(): Promise<void> {
        
        try {

            const subscription = await this.pubSubMessager?.subscribeToTopic('billet-stream');
            
            subscription?.on('message', async (message) => {
                const messageId = message.id;
                const messageData = this.parseMessageData(message.data);

                try {
                    const token = await this.kobanaService?.getToken();
                    console.log(`TOKEN: ${token}`);
                    const billetData = new BankBilletData({
                        amount: messageData.billetData.amount,
                        expire_at: messageData.billetData.expire_at,
                        customer_person_name: messageData.billetData.customer_person_name,
                        customer_cnpj_cpf: messageData.billetData.customer_cnpj_cpf,
                        customer_state: messageData.billetData.customer_state,
                        customer_city_name: messageData.billetData.customer_city_name,
                        customer_zipcode: messageData.billetData.customer_zipcode,
                        customer_address: messageData.billetData.customer_address,
                        customer_neighborhood: messageData.billetData.customer_neighborhood,
                        customer_email: messageData.billetData.customer_email,
                        interest_type: messageData.billetData.interest_type,
                        interest_days_type: messageData.billetData.interest_days_type,
                        fine_type: messageData.billetData.fine_type,
                        discount_type: messageData.billetData.discount_type,
                        charge_type: messageData.billetData.charge_type,
                        dispatch_type: messageData.billetData.dispatch_type,
                        document_type: messageData.billetData.document_type,
                        document_number: messageData.billetData.document_number,
                        acceptance: messageData.billetData.acceptance,
                        pix_txid: null,
                        prevent_pix: messageData.billetData.prevent_pix,
                        recipient_account: messageData.billetData.recipient_account,
                        reduction_amount: messageData.billetData.reduction_amount,
                        instructions_mode: messageData.billetData.instructions_mode,
                        payment_count: messageData.billetData.payment_count
                      });
                    const response = await this.kobanaService?.createBillet(billetData, token);
                    console.log('RESPONSE BILLET: ', response);

                    const emailIssuerPayload = {
                        billetUrl: response.url,
                        email: response.customer_email
                    }

                    const messageEmailPayload = JSON.stringify({message: 'Billet Generated', data: emailIssuerPayload});
                    this.messagePublisher.setTopicName('email-sender');
                    const messageId = await this.messagePublisher.publishMessage(messageEmailPayload, 'email-sender');
                    message.ack();
                } catch (error) {
                    console.error('Error on processing a message', error);
                    message.ack();
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