import * as functions from 'firebase-functions';
export class LoggerService {

    static log(message: string): void {
        functions.logger.info(message);
    }

    static error(message: string, error?: Error): void {
        functions.logger.error(message, error);
    }

    static timming(startTime: number, operation: string): void {
        const duration = Date.now() - startTime;
        functions.logger.info(`${operation} completed in ${duration}ms`);
    }
}