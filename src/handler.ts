import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';
dotenv.config();
admin.initializeApp();

import { BilletServiceFactory } from './factory/BilletServiceFactory';
import { EmailFactory } from './factory/EmailServiceFactory';
import { ErrorHandler } from './utils/ErrorHandler';
import { LoggerService} from './services/LoggerService';

export const createBillet = async (req: Request, res: Response) => {

    const startTime = Date.now();
    LoggerService.log('Creating billet function started');

    try {
        
        const invoiceData = req.body;
        const billetService = BilletServiceFactory.create();;
        await billetService.createBillet(invoiceData);

        LoggerService.log(`Billet created successfully for invoiceData: ${JSON.stringify(invoiceData)}`);
        res.status(200).send('Billet created successfully.');   

    } catch (error) {
        LoggerService.error('Error creating billet.', error as Error);
        ErrorHandler.handleError(error, (error) => {
            res.status(500).json({message: 'Error creating billet.', error});
        });

    } finally {
        LoggerService.timming(startTime, 'createBillet function');
    }

  };

export const billetGenerator = async () => {

    const startTime = Date.now();
    LoggerService.log('Billet generator started');

    try {

        const billetService = BilletServiceFactory.create();
        await billetService.generateBillet();
        
        LoggerService.log('Billet generated successfully.');

    } catch (error) {

        LoggerService.error('Error generating billet', error as Error);
        ErrorHandler.handleError(error);

    } finally{

        LoggerService.timming(startTime, 'billetGenerator function');
    }

};

export const emailSender = async () => {
    
    const startTime = Date.now();
    LoggerService.log('Email sender function started');

    try {

        const emailService = EmailFactory.create();
        await emailService.start();
        LoggerService.log('Email sent successfully.');

    } catch (error) {

        LoggerService.error('Error sending email', error as Error);
        ErrorHandler.handleError(error);

    } finally {
        LoggerService.timming(startTime, 'emailSender function');
    }

};