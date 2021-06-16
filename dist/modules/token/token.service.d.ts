import { TokenDocument } from "./token.entity";
import { Model } from "mongoose";
import { AuthToolService } from "../tool/auth-tool/auth-tool.service";
export declare class TokenService {
    private tokenModel;
    private readonly authToolService;
    constructor(tokenModel: Model<TokenDocument>, authToolService: AuthToolService);
    private JWTKey;
    setJWTKey(userID: string, jti: string, duration: number, timestamp: number): Promise<void>;
    checkJWTKey(userID: string, jti: string): Promise<boolean>;
    deleteJWTKey(userID: string, jti: string): Promise<number>;
}
