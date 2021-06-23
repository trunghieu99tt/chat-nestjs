import { UserDTO } from 'src/modules/user/dto/user.dto';
import { User } from 'src/modules/user/user.entity';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { Request } from 'express';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signUp(userDTO: UserDTO): Promise<{
        data: User;
        accessToken: string;
    }>;
    signIn(authCredentialDto: AuthCredentialsDTO): Promise<{
        accessToken: string;
    }>;
    googleAuth(tokenId: string): Promise<{
        data: User;
        accessToken: string;
    }>;
    githubAuth(code: string): Promise<{
        data: any;
        accessToken: string;
    }>;
    logout(req: Request): Promise<{
        message: string;
    }>;
}
