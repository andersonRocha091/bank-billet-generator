import { IEmailService } from "../interfaces/IEmailService";

export interface SendEmailInput {
    email: string;
    billetUrl: string;
}

export class SendEmailUseCase {
    constructor(
        private readonly emailprovider: IEmailService
    ){}

    async execute(payload: SendEmailInput): Promise<void> {
        console.log(`Executing SendEmailUseCase for email ${payload.email}`);

        await this.emailprovider.sendEmail(
            payload.email,
            'Seu boleto foi gerado',
            `Acesse seu boleto aqui ${payload.billetUrl}`
        )

        console.log('Email send succesfully')
    }
}