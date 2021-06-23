"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => {
    return ({
        port: parseInt(process.env.SERVER_PORT, 10) || 3000,
    });
};
//# sourceMappingURL=configuration.js.map