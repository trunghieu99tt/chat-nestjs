export class BackendErrorDTo extends Error {
    errorCode?: number;
    statusCode: number;
    message: any;
    details?: any;

    constructor(statusCode: number, message: any, details?: any, errorCode?: number) {
        super();
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.message = message;
        this.details = details;
    }
}