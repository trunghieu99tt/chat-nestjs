export declare class BackendErrorDTO extends Error {
    errorCode?: number;
    statusCode: number;
    message: any;
    details?: any;
    constructor(statusCode: number, message: any, details?: any, errorCode?: number);
}
