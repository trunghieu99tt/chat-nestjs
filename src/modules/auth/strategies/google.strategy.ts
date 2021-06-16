import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { BadRequestException, Injectable } from '@nestjs/common';
import { GOOGLE_CLIENT_ID, GOOGLE_SECRET } from 'src/common/config/secrets';
import { UserService } from 'src/modules/user/user.service';
import * as bcrypt from 'bcryptjs';
const GoogleTokenStrategy = require("passport-google-token").Strategy;
import { use } from 'passport';
import * as crypto from "crypto";
import { AuthToolService } from 'src/modules/tool/auth-tool/auth-tool.service';


@Injectable()
export class GoogleStrategy {
    constructor(private readonly userService: UserService,
        private readonly authToolService: AuthToolService) {
        this.init();
    }

    init() {
        use(
            "google",
            new GoogleTokenStrategy(
                {
                    clientID: GOOGLE_CLIENT_ID,
                    clientSecret: GOOGLE_SECRET,
                },
                async (
                    accessToken: string,
                    refreshToken: string,
                    profile: any,
                    done: (err: any, user?: any, info?: any) => void,
                ) => {
                    const user = await this.userService.findByGoogleID(profile.id);

                    if (user) {
                        user.password = undefined;
                        return done(null, user);
                    } else {
                        if (profile._json.email) {
                            const existedEmail = await this.userService.findByEmail(profile._json.email);
                            if (existedEmail) {
                                return done(new BadRequestException("Email does exits!"));
                            }
                        }
                        return done(
                            null,
                            await this.userService
                                .createUser(
                                    {
                                        username: null,
                                        password: await bcrypt.hash(this.authToolService.randomToken(), 10),
                                        firstName: profile._json.family_name,
                                        lastName: profile._json.given_name,
                                        photo: profile._json.picture,
                                        email: profile._json.email,
                                        bio: '',
                                        phone: '',
                                        passwordConfirm: null,
                                        google: {
                                            id: profile.id,
                                        },
                                    }
                                )
                                .then((result) => {
                                    return result;
                                }),
                        );
                    }
                }
            ),
        );
    }
}
