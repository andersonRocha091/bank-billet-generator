import { Request, Response } from 'express';
import { PubSub } from '@google-cloud/pubsub';
import { saveInvoiceData } from '@google-cloud/firestore';


export const createBillet = async (req: Request, res: Response) => {
    try {
        const invoiceData = req.body;
        const pubSubClient = new PubSub();
        const docId = await saveInvoiceData(invoiceData);

        await publishMessage({docId, invoiceData});
    } catch (error) {
        
    }
}