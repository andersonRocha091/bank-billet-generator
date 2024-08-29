import { Request, Response } from 'express';
import { BilletService }  from './services/BilletService';
import { PubsubMessagePublisher } from './utils/PubsubMessagePublisher';
import { FirestoreDataSaver } from './utils/FirestoreDataSaver';

export const createBillet = async (req: Request, res: Response) => {
    try {
        const invoiceData = req.body;
        const messagePublisher = new PubsubMessagePublisher('billet-stream', 'bank-billet-generator');
        const dataSaver = new FirestoreDataSaver('billets');
        const billetService = new BilletService(messagePublisher, dataSaver);
        await billetService.createBillet(invoiceData);
        res.status(200).send('Billet created successfully.');   
    } catch (error) {
        res.status(500).json({message: 'Error creating billet.', error})
    }
  };