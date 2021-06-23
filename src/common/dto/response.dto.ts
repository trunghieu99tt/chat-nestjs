import { BackendErrorDTO } from "./backend-error.dto";

export class ResponseDTO {
    readonly data?: any;
    readonly total?: number;
    readonly error?: BackendErrorDTO;
    readonly message?: string;
    readonly statusCode?: number;
}
