import { BankBillet } from "../domain/BankBillet";
import { RegisteredBillet } from "../domain/RegisteredBillet";
import { IBoletoService } from "../interfaces/IBoletoService";
import { IMessagePublisher } from "../interfaces/IMessagePublisher";

export interface GenerateBilletInput {
    docId: string;
    billetData: any;
}

export class GenerateBilletUseCase {
    constructor(
        private readonly boletoProvider: IBoletoService,
        private readonly messagePublisher: IMessagePublisher
    ) {}

    async execute(payload: GenerateBilletInput): Promise<void> {

         console.log(`Executing GenerateBilletUseCase for docId: ${payload.docId}`);

         //Obtaining token from adapter
         const token = await this.boletoProvider.getToken();
         console.log('Provider token acquired')

         const billet = BankBillet.create(payload.billetData); 

         // Calling the proper billet generator provider to generate it through the port   
         const registeredBillet: RegisteredBillet = await this.boletoProvider.createBillet(billet, token)
         console.log('Billet created via provider:', registeredBillet);

         const emailIssuerPayload = {
             billetUrl: registeredBillet.url,
             email: registeredBillet.customerEmail,
            };
            
        //Publishing event for email sending
         const messageEmailPayload = JSON.stringify({ message: 'Billet Generated', data: emailIssuerPayload});
         this.messagePublisher.setTopicName('email-sender');
         await this.messagePublisher.publishMessage(messageEmailPayload, 'email-sender');
         console.log('Email dispatch message published');

    }
}