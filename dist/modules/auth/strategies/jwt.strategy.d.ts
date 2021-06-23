import { Strategy } from "passport-jwt";
import { TokenService } from "src/modules/token/token.service";
import { User } from "src/modules/user/user.entity";
import { UserService } from "src/modules/user/user.service";
import { PayloadDTO } from "../dto/payload.dto";
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly userService;
    private readonly tokenService;
    constructor(userService: UserService, tokenService: TokenService);
    validate(payload: PayloadDTO): Promise<User>;
}
export {};
