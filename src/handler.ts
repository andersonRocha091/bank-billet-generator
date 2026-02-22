import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';
dotenv.config();
admin.initializeApp();

import { BilletServiceFactory } from './factory/BilletServiceFactory';
import { EmailFactory } from './factory/EmailServiceFactory';
import { ErrorHandler } from './utils/ErrorHandler';
import { LoggerService} from './services/LoggerService';

interface PubSubMessage {
    data: string; // Base64-encoded string
}

// Helper to parse data to pub/sub
const parsePubSubData = <T>(message: PubSubMessage): T => {
    const dataString = Buffer.from(message.data, 'base64').toString('utf-8');
    return JSON.parse(dataString);
};


export const createBillet = async (req: Request, res: Response) => {

    const startTime = Date.now();
    LoggerService.log('Creating billet function started');
    try {
        const createBilletUseCase = BilletServiceFactory.createGenerateBilletUseCase();
        await createBilletUseCase.execute(req.body)

        LoggerService.log(`Billet created successfully for invoiceData`);
        res.status(202).send('Billet created successfully.'); 
    } catch (error) {
        LoggerService.error('Error in createBillet handler.', error as Error);
        res.status(400).json({ message: 'Invalid billet data.', error: (error as Error).message });

    } finally {
        LoggerService.timming(startTime, 'createBillet function')
    }

  };

// Handler pub/sub to generate billet via external provider
export const billetGenerator = async (message: PubSubMessage) => {

    const startTime = Date.now();
    LoggerService.log('Billet generator started');

    try {
         const payload = parsePubSubData<any>(message);
         const generatedBilletUseCase = BilletServiceFactory.createGenerateBilletUseCase();
         await generatedBilletUseCase.execute(payload)

         LoggerService.log('Billet generated and email event published');
    } catch (error) {
        LoggerService.error('Error in billetGenerator handler. This will trigger a retry.', error as Error);
        // We need to throw erro for retry policy being executed
        throw error;

    } finally {
        LoggerService.timming(startTime, 'billetGenerator function');
    }

};

/**
* Handler Pub/Sub for email sending
*/
export const emailSender = async (message: PubSubMessage) => {
    
    const startTime = Date.now();
    LoggerService.log('Email sender function triggered');

    try {
        // Now we are reading a payload comming from billetGenerator
        const payload = parsePubSubData<{data: any}>(message);
        const sendEmailUseCase = EmailFactory.createSendEmailUseCase();

        await sendEmailUseCase.execute(payload.data);
        LoggerService.log('Email sent successfully.');
    } catch (error) {
        LoggerService.error('Error in emailSender handler. This will trigger a retry.', error as Error);
        throw error;
    } finally {
        LoggerService.timming(startTime, 'emailSender function');
    }

};