import { yellow } from "chalk";
import * as dotenv from "dotenv";

dotenv.config();

export const getEnv = (key: string, ignore = false): string => {
    const value = process.env[key];
    if (!ignore && value === undefined) {
        console.log(yellow(`[ENV] ${key} not found!`));
    }
    return value;
};

// Mongo
export const MONGO_USERNAME = getEnv('MONGO_USERNAME');
export const MONGO_PASSWORD = getEnv('MONGO_PASSWORD');
export const MONGO_DB = getEnv('MONGO_DB');
export const MONGO_URI = getEnv('MONGO_URI')
    .replace("<USERNAME>", MONGO_USERNAME)
    .replace("<PASSWORD>", MONGO_PASSWORD)
    .replace("<DB_NAME>", MONGO_DB)

export const SERVER_PORT = getEnv("SERVER_PORT");
export const PORT = getEnv("PORT");

// Auth
export const GOOGLE_CLIENT_ID = getEnv('GOOGLE_CLIENT_ID');
export const GOOGLE_SECRET = getEnv('GOOGLE_SECRET');
export const JWT_EXP = Number(getEnv('JWT_EXP'))
export const JWT_SECRET = getEnv('JWT_SECRET')
export const GITHUB_CLIENT_ID = getEnv('GITHUB_CLIENT_ID');
export const GITHUB_CLIENT_SECRET = getEnv('GITHUB_CLIENT_SECRET');
export const GITHUB_REDIRECT_URL = getEnv('GITHUB_REDIRECT_URL');

// Cloudinary
export const CLOUDINARY_URL = getEnv('CLOUDINARY_URL');
export const CLOUDINARY_PATH = getEnv('CLOUDINARY_PATH');

export const MAILER_EMAIL_ID = getEnv('MAILER_EMAIL_ID');
export const MAILER_PASSWORD = getEnv('MAILER_PASSWORD');

// Redis
export const REDIS_PORT = Number(getEnv("REDIS_PORT"));
export const REDIS_HOST = getEnv("REDIS_HOST");
export const REDIS_PASSWORD = getEnv("REDIS_PASSWORD");