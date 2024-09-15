import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
import { BilletServiceFactory } from './factory/BilletServiceFactory';
import { EmailFactory } from './factory/EmailServiceFactory';

export const createBillet = async (req: Request, res: Response) => {
    
    try {
        const invoiceData = req.body;
        const billetService = BilletServiceFactory.create();;
        await billetService.createBillet(invoiceData); 
        res.status(200).send('Billet created successfully.');   
    } catch (error) {
        res.status(500).json({message: 'Error creating billet.', error})
    }

  };

export const billetGenerator = async () => {

    console.log('Billet generator started');
    try {
        const billetService = BilletServiceFactory.create();
        await billetService.generateBillet();   
    } catch (error) {
        console.error('Error on generating billet: ', error);
    }

};

export const emailSender = async () => {
        
    try {
        
        const emailService = EmailFactory.create();
        await emailService.start();

    } catch (error) {

        console.error('Error on sending email', error);
    }

};