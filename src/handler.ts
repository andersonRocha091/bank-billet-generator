import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
import { BilletService }  from './services/BilletService';
import { MailGunEmailService }  from './services/MailGunEmailService';
import { PubsubMessagePublisher } from './utils/PubsubMessagePublisher';
import { FirestoreDataSaver } from './utils/FirestoreDataSaver';
import { KobanaService } from './services/KobanaService';
import { HttpClient } from './client/HttpClient';
import { EmailService } from './services/EmailService';
import { BilletServiceFactory } from './factory/BilletServiceFactory';
import { EmailFactory } from './factory/EmailServiceFactory';

export const createBillet = async (req: Request, res: Response) => {
    try {
        const invoiceData = req.body;
        
        
        // const messagePublisher = new PubsubMessagePublisher('bank-billet-generator');
        // messagePublisher.setTopicName('billet-stream');
        // const dataSaver = new FirestoreDataSaver('billets');
        // const billetService = new BilletService(messagePublisher, dataSaver);
        // await billetService.createBillet(invoiceData);
        const billetService = BilletServiceFactory.create();;
        await billetService.createBillet(invoiceData); 
        res.status(200).send('Billet created successfully.');   
    } catch (error) {
        res.status(500).json({message: 'Error creating billet.', error})
    }
  };

export const billetGenerator = async () => {

    console.log('Billet generator started');
    // const topicName = 'billet-stream';
    // const subscriptionName = 'bank-billet-generator';

    // // Servico responsavel por inscricao/subscricao em topicos
    // const messagePublisher = new PubsubMessagePublisher(subscriptionName);
    // messagePublisher.setTopicName(topicName);
    // //client default para requisicoes http
    // const httpClient = new HttpClient();
    // //Servico de emissao de boletos
    // const { KOBANA_CLIENT_ID, KOBANA_CLIENT_SECRET, KOBANA_API_URL, KOBANA_AUTH_URL} = process.env;
    // const kobanaService = new KobanaService(
    //     httpClient,
    //     KOBANA_CLIENT_ID ?? '',
    //     KOBANA_CLIENT_SECRET ?? '',
    //     KOBANA_API_URL ?? 'https://api-sandbox.kobana.com.br',
    //     KOBANA_AUTH_URL ?? 'https://app-sandbox.kobana.com.br'
    // );
    // const billetService = new BilletService(messagePublisher, new FirestoreDataSaver('billets'), kobanaService, messagePublisher);
    // await billetService.generateBillet();

    const billetService = BilletServiceFactory.create();
    await billetService.generateBillet();

};

export const emailSender = async () => {
        
    // const mailGunApiKey = process.env.MAILGUN_API_KEY ?? '';
    // const mailGunDomain = process.env.MAILGUN_DOMAIN ?? '';
    // const messagePublisher = new PubsubMessagePublisher('bank-billet-generator');
    // messagePublisher.setTopicName('email-sender');
    // const emailServiceProvider = new MailGunEmailService(mailGunApiKey, mailGunDomain);
    // const emailService = new EmailService(messagePublisher, emailServiceProvider);

    try {
        
        const emailService = EmailFactory.create();
        await emailService.start();

    } catch (error) {

        console.error('Error on sending email', error);
    }

};