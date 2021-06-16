import { Body, Controller, Get, Post, Redirect, Req, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserDTO } from 'src/modules/user/dto/user.dto';
import { User, UserDocument } from 'src/modules/user/user.entity';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { Request } from 'express'

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post("/signup")
    signUp(@Body() userDTO: UserDTO): Promise<{ data: User, accessToken: string }> {
        return this.authService.signUp(userDTO);
    }

    @Post("/signin")
    signIn(@Body(ValidationPipe) authCredentialDto: AuthCredentialsDTO) {
        return this.authService.signIn(authCredentialDto);
    }

    @Post("/google")
    async googleAuth(@Body('tokenId') tokenId: string) {
        return this.authService.googleLogin(tokenId);
    }

    @Post('/github')
    async githubAuth(@Body('code') code: string) {
        return this.authService.githubLogin(code);
    }

    @Post('logout')
    @UseGuards(AuthGuard('jwt'))
    async logout(@Req() req: Request): Promise<{ message: string }> {
        return await this.authService.logout(req.user as UserDocument);
    }

}
