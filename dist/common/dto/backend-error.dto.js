"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackendErrorDTO = void 0;
class BackendErrorDTO extends Error {
    constructor(statusCode, message, details, errorCode) {
        super();
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.message = message;
        this.details = details;
    }
}
exports.BackendErrorDTO = BackendErrorDTO;
//# sourceMappingURL=backend-error.dto.js.map