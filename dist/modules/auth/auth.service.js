"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const secrets_1 = require("../../common/config/secrets");
const user_dto_1 = require("../user/dto/user.dto");
const user_entity_1 = require("../user/user.entity");
const user_service_1 = require("../user/user.service");
const { OAuth2Client } = require('google-auth-library');
const bcrypt = require("bcryptjs");
const auth_tool_service_1 = require("../tool/auth-tool/auth-tool.service");
const mongodb_1 = require("mongodb");
const token_service_1 = require("../token/token.service");
let AuthService = class AuthService {
    constructor(userService, jwtService, httpService, tokenService, authToolService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.httpService = httpService;
        this.tokenService = tokenService;
        this.authToolService = authToolService;
    }
    async generateAccessToken(payload) {
        const accessToken = this.jwtService.sign(payload);
        return accessToken;
    }
    async signUp(userDto, timestamp = Date.now()) {
        const jti = new mongodb_1.ObjectID().toHexString();
        const newUser = await this.userService.createUser(Object.assign(Object.assign({}, userDto), { isThirdParty: false }));
        const payload = {
            sub: newUser._id,
            jti
        };
        this.tokenService.setJWTKey(newUser._id, jti, secrets_1.JWT_EXP, timestamp);
        return {
            data: newUser,
            accessToken: await this.generateAccessToken(payload)
        };
    }
    async signIn(authCredentialDto, timestamp = Date.now()) {
        const { username, password } = authCredentialDto;
        const user = await this.userService.findByUsername(username);
        if (!user) {
            throw new common_1.NotFoundException("There is no user with this username");
        }
        const isCorrectPassword = await user.comparePassword(password);
        if (!isCorrectPassword) {
            throw new common_1.UnauthorizedException("Wrong username/password");
        }
        const jti = new mongodb_1.ObjectID().toHexString();
        const payload = {
            sub: user._id,
            jti,
        };
        this.tokenService.setJWTKey(user._id, jti, secrets_1.JWT_EXP, timestamp);
        const accessToken = await this.generateAccessToken(payload);
        return {
            accessToken
        };
    }
    async logout(user) {
        try {
            this.tokenService.deleteJWTKey(user._id, user.jti);
            return { message: "Good bye :)" };
        }
        catch (error) {
            console.log(`logout error`, error);
        }
    }
    async googleLogin(tokenId) {
        const client = new OAuth2Client(secrets_1.GOOGLE_CLIENT_ID);
        const response = await client.verifyIdToken({ idToken: tokenId, audience: secrets_1.GOOGLE_CLIENT_ID });
        const { email_verified, name, email, given_name, family_name, sub, picture } = response.payload;
        if (email_verified) {
            const user = await this.userService.findByEmail(email);
            if (user) {
                const jti = new mongodb_1.ObjectID().toHexString();
                const jwtPayload = {
                    sub: user._id,
                    jti,
                };
                this.tokenService.setJWTKey(user._id, jti, secrets_1.JWT_EXP, Date.now());
                return {
                    data: user,
                    accessToken: await this.generateAccessToken(jwtPayload)
                };
            }
            else {
                try {
                    const initialPassword = await bcrypt.hash(this.authToolService.randomToken(), 10);
                    const response = await this.userService
                        .createUser({
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
                    });
                    const jti = new mongodb_1.ObjectID().toHexString();
                    const jwtPayload = {
                        sub: response._id,
                        jti,
                    };
                    this.tokenService.setJWTKey(response._id, jti, secrets_1.JWT_EXP, Date.now());
                    return {
                        data: response,
                        accessToken: await this.generateAccessToken(jwtPayload)
                    };
                }
                catch (error) {
                    console.log(`error`, error);
                }
            }
        }
        else {
            throw new common_1.BadRequestException("This account has not verified yet. Please verify it before logging");
        }
    }
    async githubLogin(code) {
        const payload = {
            "client_id": secrets_1.GITHUB_CLIENT_ID,
            "client_secret": secrets_1.GITHUB_CLIENT_SECRET,
            "code": code,
            "redirect_url": secrets_1.GITHUB_REDIRECT_URL
        };
        const url = 'https://github.com/login/oauth/access_token';
        const responseToken = await this.httpService.post(url, payload).toPromise();
        const params = new URLSearchParams(responseToken.data);
        const accessToken = params.get('access_token');
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
            const jti = new mongodb_1.ObjectID().toHexString();
            const jwtPayload = {
                sub: user._id,
                jti,
            };
            this.tokenService.setJWTKey(user._id, jti, secrets_1.JWT_EXP, Date.now());
            return {
                data: user,
                accessToken: await this.generateAccessToken(jwtPayload)
            };
        }
        else {
            try {
                const initialPassword = await bcrypt.hash(this.authToolService.randomToken(), 10);
                const response = await this.userService
                    .createUser({
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
                });
                const jti = new mongodb_1.ObjectID().toHexString();
                const jwtPayload = {
                    sub: response._id,
                    jti,
                };
                this.tokenService.setJWTKey(response._id, jti, secrets_1.JWT_EXP, Date.now());
                return {
                    data: response,
                    accessToken: await this.generateAccessToken(jwtPayload)
                };
            }
            catch (error) {
                console.log(`error`, error);
            }
        }
        name;
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        common_1.HttpService,
        token_service_1.TokenService,
        auth_tool_service_1.AuthToolService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map