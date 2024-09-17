import { Request, Response } from 'express';
import { SpanStatusCode, trace } from '@opentelemetry/api';
import './OpenTelemetry.config';
import * as dotenv from 'dotenv';
dotenv.config();
const tracer = trace.getTracer('billet-generator','1.0.0');


import { BilletServiceFactory } from './factory/BilletServiceFactory';
import { EmailFactory } from './factory/EmailServiceFactory';
import { ErrorHandler } from './utils/ErrorHandler';

export const createBillet = async (req: Request, res: Response) => {
    
    const span = tracer.startSpan('createBilletTrace');
    span.setAttribute('http.method', req.method);
    span.setAttribute('http.url', req.originalUrl);

    try {
        const invoiceData = req.body;
        span.setAttribute('invoiceData', JSON.stringify(invoiceData));
        const billetService = BilletServiceFactory.create();;
        await billetService.createBillet(invoiceData);

        span.setStatus({code: SpanStatusCode.OK});
        span.setAttribute('invoiceData', invoiceData);
        span.end(); 
        res.status(200).send('Billet created successfully.');   
    } catch (error) {
        
        ErrorHandler.handleError(span, error, (error) => {
            res.status(500).json({message: 'Error creating billet.', error});
        });

    }

  };

export const billetGenerator = async () => {

    console.log('Billet generator started');
    const span = tracer.startSpan('billetGeneratorTrace');

    try {
        span.setAttribute('operation', 'billetGenerator');
        const billetService = BilletServiceFactory.create();
        await billetService.generateBillet();   

        span.setStatus({code: SpanStatusCode.OK});
        span.end();
    } catch (error) {

       ErrorHandler.handleError(span, error);
    }

};

export const emailSender = async () => {

    const span = tracer.startSpan('emailSenderTrace');    

    try {
        span.setAttribute('operation', 'startEmailService');
        const emailService = EmailFactory.create();
        await emailService.start();

        span.setAttribute('emailStatus', 'sent');
        span.setStatus({code: SpanStatusCode.OK});
        span.end();

    } catch (error) {

        ErrorHandler.handleError(span, error);
    }

};