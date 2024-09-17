import { SpanStatusCode } from '@opentelemetry/api';
export class ErrorHandler {
    static handleError(span: any, error: any, callback?: (error: any) => void) {

        span.recordException(error || '');
        span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
        span.end();
        if (callback) {
            callback(error);
        } else {
            console.error('Error ocurred: ', error);
        }
    }
}