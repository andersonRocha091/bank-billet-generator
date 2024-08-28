import { Request, Response } from 'express';
import { BilletService }  from './services/BilletService';
import { PubsubMessagePublisher } from './utils/PubsubMessagePublisher';
import { FirestoreDataSaver } from './utils/FirestoreDataSaver';


// export const createBillet = async (req: Request, res: Response) => {
// export const createBillet = async (data: any) => {
//     try {
//         const invoiceData = data;
//         const messagePublisher = new PubsubMessagePublisher('invoice-creation-topic', 'bank-billet-generator');
//         const firestoreDataSaver = new FirestoreDataSaver('invoices');

//         const billetService = new BilletService(messagePublisher, firestoreDataSaver);
//         await billetService.createBillet(invoiceData);
//         console.log('SUCCESSFULLY CREATED BILLET');

//     } catch (error) {
//         console.log(JSON.stringify(error));
//     }
// }

export const createBillet = async (req: Request, res: Response) => {
    try {
        const invoiceData = req.body;
        const messagePublisher = new PubsubMessagePublisher('your-topic-name', 'your-project-id');
        const dataSaver = new FirestoreDataSaver('billets');
        const billetService = new BilletService(messagePublisher, dataSaver);
        await billetService.createBillet(invoiceData);
        res.status(200).send('Billet created successfully.');   
    } catch (error) {
        res.status(500).json({message: 'Error creating billet.', error})
    }
  };