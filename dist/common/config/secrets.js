"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REDIS_PASSWORD = exports.REDIS_HOST = exports.REDIS_PORT = exports.MAILER_PASSWORD = exports.MAILER_EMAIL_ID = exports.CLOUDINARY_URL = exports.GITHUB_REDIRECT_URL = exports.GITHUB_CLIENT_SECRET = exports.GITHUB_CLIENT_ID = exports.JWT_SECRET = exports.JWT_EXP = exports.GOOGLE_SECRET = exports.GOOGLE_CLIENT_ID = exports.SERVER_PORT = exports.MONGO_URI = exports.MONGO_DB = exports.MONGO_PASSWORD = exports.MONGO_USERNAME = exports.getEnv = void 0;
const chalk_1 = require("chalk");
const dotenv = require("dotenv");
dotenv.config();
const getEnv = (key, ignore = false) => {
    const value = process.env[key];
    if (!ignore && value === undefined) {
        console.log(chalk_1.yellow(`[ENV] ${key} not found!`));
    }
    return value;
};
exports.getEnv = getEnv;
exports.MONGO_USERNAME = exports.getEnv('MONGO_USERNAME');
exports.MONGO_PASSWORD = exports.getEnv('MONGO_PASSWORD');
exports.MONGO_DB = exports.getEnv('MONGO_DB');
exports.MONGO_URI = exports.getEnv('MONGO_URI')
    .replace("<USERNAME>", exports.MONGO_USERNAME)
    .replace("<PASSWORD>", exports.MONGO_PASSWORD)
    .replace("<DB_NAME>", exports.MONGO_DB);
exports.SERVER_PORT = exports.getEnv("SERVER_PORT");
exports.GOOGLE_CLIENT_ID = exports.getEnv('GOOGLE_CLIENT_ID');
exports.GOOGLE_SECRET = exports.getEnv('GOOGLE_SECRET');
exports.JWT_EXP = Number(exports.getEnv('JWT_EXP'));
exports.JWT_SECRET = exports.getEnv('JWT_SECRET');
exports.GITHUB_CLIENT_ID = exports.getEnv('GITHUB_CLIENT_ID');
exports.GITHUB_CLIENT_SECRET = exports.getEnv('GITHUB_CLIENT_SECRET');
exports.GITHUB_REDIRECT_URL = exports.getEnv('GITHUB_REDIRECT_URL');
exports.CLOUDINARY_URL = exports.getEnv('CLOUDINARY_URL');
exports.MAILER_EMAIL_ID = exports.getEnv('MAILER_EMAIL_ID');
exports.MAILER_PASSWORD = exports.getEnv('MAILER_PASSWORD');
exports.REDIS_PORT = Number(exports.getEnv("REDIS_PORT"));
exports.REDIS_HOST = exports.getEnv("REDIS_HOST");
exports.REDIS_PASSWORD = exports.getEnv("REDIS_PASSWORD");
//# sourceMappingURL=secrets.js.map