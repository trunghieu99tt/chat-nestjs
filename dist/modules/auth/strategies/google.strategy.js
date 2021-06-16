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
exports.GoogleStrategy = void 0;
const common_1 = require("@nestjs/common");
const secrets_1 = require("../../../common/config/secrets");
const user_service_1 = require("../../user/user.service");
const bcrypt = require("bcryptjs");
const GoogleTokenStrategy = require("passport-google-token").Strategy;
const passport_1 = require("passport");
const auth_tool_service_1 = require("../../tool/auth-tool/auth-tool.service");
let GoogleStrategy = class GoogleStrategy {
    constructor(userService, authToolService) {
        this.userService = userService;
        this.authToolService = authToolService;
        this.init();
    }
    init() {
        passport_1.use("google", new GoogleTokenStrategy({
            clientID: secrets_1.GOOGLE_CLIENT_ID,
            clientSecret: secrets_1.GOOGLE_SECRET,
        }, async (accessToken, refreshToken, profile, done) => {
            const user = await this.userService.findByGoogleID(profile.id);
            if (user) {
                user.password = undefined;
                return done(null, user);
            }
            else {
                if (profile._json.email) {
                    const existedEmail = await this.userService.findByEmail(profile._json.email);
                    if (existedEmail) {
                        return done(new common_1.BadRequestException("Email does exits!"));
                    }
                }
                return done(null, await this.userService
                    .createUser({
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
                })
                    .then((result) => {
                    return result;
                }));
            }
        }));
    }
};
GoogleStrategy = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        auth_tool_service_1.AuthToolService])
], GoogleStrategy);
exports.GoogleStrategy = GoogleStrategy;
//# sourceMappingURL=google.strategy.js.map