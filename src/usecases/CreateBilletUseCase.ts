import { BankBillet } from "../domain/BankBillet";
import { IDataSaver } from "../interfaces/IDataSaver";
import { IMessagePublisher } from "../interfaces/IMessagePublisher";

export interface CreateBilletInput {
    amount: number;
    expire_at: string;
    customer_person_name: string; 
    customer_cnpj_cpf: string;
    customer_state: string;
    customer_city_name: string;
    customer_zipcode: string;
    customer_address: string;
    customer_neighborhood: string;
    customer_email?: string;
    interest_type: number;
    interest_days_type: number;
    fine_type: number;
    discount_type: number;
    charge_type: number;
    dispatch_type: number;
    document_type: string;
    document_number?: string;
    acceptance: string;
    pix_txid?: string;
    prevent_pix?: boolean;
    recipient_account?: string;
    reduction_amount?: number;
    instructions_mode?:  number;
    payment_count: number;
}

export class CreateBilletUseCase {
    constructor(
        private readonly messagePublisher: IMessagePublisher,
        private readonly dataSaver: IDataSaver<any>
    ) {}

    async execute(invoiceData: CreateBilletInput): Promise<void> {

        console.log('Executing CreateBilletUseCase');

        const billetData = BankBillet.create(invoiceData)

        console.log('Billet created and validated')

        const docId = await this.dataSaver.saveData({...invoiceData, billet: billetData.getData()});

        const message = JSON.stringify({
            message: 'Billet creation requested',
            docId: docId,
            billetData: billetData.getData()
        })

        this.messagePublisher.setTopicName('billet-stream');
        await this.messagePublisher.publishMessage(message, 'billet-stream');
        console.log(`Message published for docId: ${docId}`);
    }
}