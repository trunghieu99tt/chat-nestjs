"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackendErrorDTo = void 0;
class BackendErrorDTo extends Error {
    constructor(statusCode, message, details, errorCode) {
        super();
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.message = message;
        this.details = details;
    }
}
exports.BackendErrorDTo = BackendErrorDTo;
//# sourceMappingURL=backend-error.dto.js.map