export class ErrorHandler {
    static handleError(error: any, callback?: (error: any) => void) {
        if (callback) {
            callback(error);
        } else {
            console.error('Error ocurred: ', error);
        }
    }
}