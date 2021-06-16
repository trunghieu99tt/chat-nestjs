import { HttpService } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from 'src/modules/user/dto/user.dto';
import { User, UserDocument } from 'src/modules/user/user.entity';
import { UserService } from 'src/modules/user/user.service';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { AuthToolService } from '../tool/auth-tool/auth-tool.service';
import { PayloadDTO } from './dto/payload.dto';
import { TokenService } from '../token/token.service';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    private readonly httpService;
    private readonly tokenService;
    private readonly authToolService;
    constructor(userService: UserService, jwtService: JwtService, httpService: HttpService, tokenService: TokenService, authToolService: AuthToolService);
    generateAccessToken(payload: PayloadDTO): Promise<string>;
    signUp(userDto: UserDTO, timestamp?: number): Promise<{
        data: User;
        accessToken: string;
    }>;
    signIn(authCredentialDto: AuthCredentialsDTO, timestamp?: number): Promise<{
        accessToken: string;
    }>;
    logout(user: UserDocument): Promise<{
        message: string;
    }>;
    googleLogin(tokenId: string): Promise<{
        data: User;
        accessToken: string;
    }>;
    githubLogin(code: string): Promise<{
        data: any;
        accessToken: string;
    }>;
}
