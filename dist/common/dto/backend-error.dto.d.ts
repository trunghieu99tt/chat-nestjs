export declare class BackendErrorDTo extends Error {
    errorCode?: number;
    statusCode: number;
    message: any;
    details?: any;
    constructor(statusCode: number, message: any, details?: any, errorCode?: number);
}
