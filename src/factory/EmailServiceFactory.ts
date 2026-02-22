import { PubsubMessagePublisher } from '../utils/PubsubMessagePublisher';
import { MailGunEmailService } from '../services/MailGunEmailService';
import { Message } from '@google-cloud/pubsub';
import { SendEmailUseCase } from '../usecases/SendEmailUseCase';



interface IEmailService {
    start(): Promise<void>;
}

export class EmailFactory {


    static createSendEmailUseCase(): SendEmailUseCase {
        const mailGunService = new MailGunEmailService(
            process.env.MAILGUN_API_KEY ?? '',
            process.env.MAILGUN_DOMAIN ?? '',
        );
        return new SendEmailUseCase(mailGunService);
    }

    // static create(): IEmailService { 
        
        
    //     const mailGunApiKey = process.env.MAILGUN_API_KEY ?? '';
    //     const mailGunDomain = process.env.MAILGUN_DOMAIN ?? '';
    //     const messagePublisher = new PubsubMessagePublisher('bank-billet-generator');
    //     messagePublisher.setTopicName('email-sender');
    //     const emailServiceProvider = new MailGunEmailService(mailGunApiKey, mailGunDomain); 
        
    //     const emailService = new EmailService(messagePublisher, emailServiceProvider);
    //     return emailService;
    // }
}   