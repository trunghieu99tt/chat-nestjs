import { BadRequestException, HttpService, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GITHUB_CLIENT_ID, GOOGLE_CLIENT_ID, GOOGLE_SECRET, JWT_EXP, GITHUB_REDIRECT_URL, GITHUB_CLIENT_SECRET } from 'src/common/config/secrets';
import { UserDTO } from 'src/modules/user/dto/user.dto';
import { User, UserDocument } from 'src/modules/user/user.entity';
import { UserService } from 'src/modules/user/user.service';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
const { OAuth2Client } = require('google-auth-library');
import * as bcrypt from 'bcryptjs';
import { AuthToolService } from '../tool/auth-tool/auth-tool.service';
import { ObjectID } from 'mongodb'
import { PayloadDTO } from './dto/payload.dto';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly httpService: HttpService,
        private readonly tokenService: TokenService,
        private readonly authToolService: AuthToolService) {
    }

    // create jwt access token based on userId
    async generateAccessToken(payload: PayloadDTO) {
        const accessToken = this.jwtService.sign(payload);
        return accessToken
    }

    async signUp(userDto: UserDTO, timestamp: number = Date.now()): Promise<{ data: User, accessToken: string }> {
        const jti = new ObjectID().toHexString();
        const newUser = await this.userService.createUser({ ...userDto, isThirdParty: false });
        const payload = {
            sub: newUser._id,
            jti
        } as PayloadDTO;
        this.tokenService.setJWTKey(newUser._id, jti, JWT_EXP, timestamp);
        return {
            data: newUser,
            accessToken: await this.generateAccessToken(payload)
        };
    }

    async signIn(authCredentialDto: AuthCredentialsDTO, timestamp: number = Date.now()): Promise<{ accessToken: string }> {
        const { username, password } = authCredentialDto;
        const user = await this.userService.findByUsername(username);
        if (!user) {
            throw new NotFoundException("There is no user with this username");
        }
        const isCorrectPassword = await user.comparePassword(password);
        if (!isCorrectPassword) {
            throw new UnauthorizedException("Wrong username/password");
        }
        const jti = new ObjectID().toHexString();
        const payload = {
            sub: user._id,
            jti,
        } as PayloadDTO;
        this.tokenService.setJWTKey(user._id, jti, JWT_EXP, timestamp);
        const accessToken = await this.generateAccessToken(payload);
        return {
            accessToken
        }

    }

    async logout(user: UserDocument): Promise<{ message: string }> {
        try {
            this.tokenService.deleteJWTKey(user._id, user.jti);
            return { message: "Good bye :)" };
        } catch (error) {
            console.log(`logout error`, error)
        }
    }

    async googleLogin(tokenId: string) {
        const client = new OAuth2Client(GOOGLE_CLIENT_ID);
        const response = await client.verifyIdToken({ idToken: tokenId, audience: GOOGLE_CLIENT_ID });
        const { email_verified, name, email, given_name, family_name, sub, picture } = response.payload;

        if (email_verified) {
            const user = await this.userService.findByEmail(email);
            if (user) {

                // If user with email already exists, return user data and access token

                const jti = new ObjectID().toHexString();
                const jwtPayload = {
                    sub: user._id,
                    jti,
                } as PayloadDTO;
                this.tokenService.setJWTKey(user._id, jti, JWT_EXP, Date.now());
                return {
                    data: user,
                    accessToken: await this.generateAccessToken(jwtPayload)
                }
            } else {
                try {
                    /**
                     *  If not, create a new user based on with google account information
                     *  Note that we will generate a mock username and password 
                     *  so after logging in using google, if use want to switch to username/password auth,
                     *  user must update username and password first!
                     *  */
                    const initialPassword = await bcrypt.hash(this.authToolService.randomToken(), 10);
                    const response = await this.userService
                        .createUser(
                            {
                                username: `${name}-${new Date().getTime()}`,
                                password: initialPassword,
                                firstName: family_name,
                                lastName: given_name,
                                photo: picture,
                                email,
                                bio: '',
                                phone: '',
                                passwordConfirm: initialPassword,
                                google: {
                                    id: sub,
                                },
                                isThirdParty: true,
                            }
                        );


                    const jti = new ObjectID().toHexString();
                    const jwtPayload = {
                        sub: response._id,
                        jti,
                    } as PayloadDTO;

                    this.tokenService.setJWTKey(response._id, jti, JWT_EXP, Date.now());

                    return {
                        data: response,
                        accessToken: await this.generateAccessToken(jwtPayload)
                    }
                } catch (error) {
                    console.log(`error`, error)
                }
            }
        }
        else {
            throw new BadRequestException("This account has not verified yet. Please verify it before logging")
        }
    }

    async githubLogin(code: string) {

        // get access token 
        const payload = {
            "client_id": GITHUB_CLIENT_ID,
            "client_secret": GITHUB_CLIENT_SECRET,
            "code": code,
            "redirect_url": GITHUB_REDIRECT_URL
        };
        const url = 'https://github.com/login/oauth/access_token';
        const responseToken = await this.httpService.post(
            url,
            payload
        ).toPromise();
        const params = new URLSearchParams(responseToken.data);
        const accessToken = params.get('access_token');

        // get user info
        const responseUser = await this.httpService.get(`https://api.github.com/user`, {
            headers: {
                Authorization: `token ${accessToken}`,
            }
        }).toPromise();

        const { email, avatar_url, name, bio, id } = responseUser.data;

        let user = null;
        if (email) {
            user = await this.userService.findByEmail(email);
        }
        if (user) {

            const jti = new ObjectID().toHexString();
            const jwtPayload = {
                sub: user._id,
                jti,
            } as PayloadDTO;

            this.tokenService.setJWTKey(user._id, jti, JWT_EXP, Date.now());

            return {
                data: user,
                accessToken: await this.generateAccessToken(jwtPayload)
            }
        } else {
            try {

                /**
                 *  If not, create a new user based on with github account information
                 *  Note that we will generate a mock username and password 
                 *  so after logging in using github, if use want to switch to username/password auth,
                 *  user must update username and password first!
                 *  */
                const initialPassword = await bcrypt.hash(this.authToolService.randomToken(), 10);
                const response = await this.userService
                    .createUser(
                        {
                            username: `${name}-${new Date().getTime()}`,
                            password: initialPassword,
                            firstName: name,
                            lastName: '',
                            photo: avatar_url,
                            email,
                            bio: bio,
                            phone: '',
                            passwordConfirm: initialPassword,
                            github: {
                                id: id,
                            },
                            isThirdParty: true,
                        }
                    );

                const jti = new ObjectID().toHexString();
                const jwtPayload = {
                    sub: response._id,
                    jti,
                } as PayloadDTO;

                this.tokenService.setJWTKey(response._id, jti, JWT_EXP, Date.now());


                return {
                    data: response,
                    accessToken: await this.generateAccessToken(jwtPayload)
                }
            } catch (error) {
                console.log(`error`, error)
            }
        } name

    }

}
