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

  export const billetGenerator = async() => {
    
    console.log('Billet generator started');
    try {
        const messagePublisher = new PubsubMessagePublisher('billet-stream', 'bank-billet-generator');
        const subscription = await messagePublisher.subscribeToTopic('billet-stream');
        
        if(subscription) {
            subscription.on('message', async (message) => {
                console.log(`MEssage received: ${message.data}`); 
            })
        }   
    } catch (error) {
        console.error('Error on generatin a billet due', error);
    }
  }