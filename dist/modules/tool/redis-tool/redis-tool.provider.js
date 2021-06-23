"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisToolProvider = exports.REDIS_CLIENT = void 0;
const Redis = require("ioredis");
const secrets_1 = require("../../../common/config/secrets");
exports.REDIS_CLIENT = "REDIS_CLIENT";
exports.RedisToolProvider = {
    provide: exports.REDIS_CLIENT,
    useFactory: () => {
        return new Redis({
            host: secrets_1.REDIS_HOST,
            port: secrets_1.REDIS_PORT,
            password: secrets_1.REDIS_PASSWORD
        });
    }
};
//# sourceMappingURL=redis-tool.provider.js.map