import { IEmailService } from "../interfaces/IEmailService";
import MailGun from 'mailgun-js'


export class MailGunEmailService implements IEmailService {

    private mailGun;

    constructor(apiKey: string, domain: string) {
        this.mailGun = new MailGun({apiKey, domain});
    }

    async sendEmail(to: string, subject: string, text: string): Promise<void> {

        const data = {
            from: `Mailgun Sandbox <postmaster@${process.env.MAILGUN_DOMAIN}>`,
            to,
            subject,
            text
        }

        try {
            const response = await this.mailGun.messages().send(data);
            console.log('RESPONSE EMAIL: ', response);
        } catch (error) {
            console.error('ERROR: ', error);
            throw error;
        }
    }


}