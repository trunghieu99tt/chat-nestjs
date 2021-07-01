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
exports.UserSchema = exports.User = exports.USER_MODEL = exports.SystemInfoSchema = exports.SystemInfo = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const class_validator_1 = require("class-validator");
const users_constants_1 = require("./constants/users.constants");
const bcrypt = require("bcryptjs");
let SystemInfo = class SystemInfo {
};
__decorate([
    mongoose_1.Prop({
        type: Boolean,
        default: false,
    }),
    __metadata("design:type", Boolean)
], SystemInfo.prototype, "indentityValidate", void 0);
__decorate([
    mongoose_1.Prop({
        type: Boolean,
        default: false,
    }),
    __metadata("design:type", Boolean)
], SystemInfo.prototype, "emailValidate", void 0);
__decorate([
    mongoose_1.Prop({
        type: Boolean,
        default: false,
    }),
    __metadata("design:type", Boolean)
], SystemInfo.prototype, "thirdPartyAuth", void 0);
SystemInfo = __decorate([
    mongoose_1.Schema({})
], SystemInfo);
exports.SystemInfo = SystemInfo;
exports.SystemInfoSchema = mongoose_1.SchemaFactory.createForClass(SystemInfo);
exports.USER_MODEL = "users";
let User = class User {
};
__decorate([
    class_validator_1.IsString(),
    mongoose_1.Prop({
        type: String,
        required: false,
        trim: true,
        maxlength: users_constants_1.USER_CONST.NAME_MAX_LENGTH
    }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    class_validator_1.IsString(),
    mongoose_1.Prop({
        type: String,
        required: false,
        trim: true,
        maxlength: users_constants_1.USER_CONST.NAME_MAX_LENGTH
    }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    class_validator_1.IsString(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], User.prototype, "photo", void 0);
__decorate([
    class_validator_1.IsString(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], User.prototype, "bio", void 0);
__decorate([
    class_validator_1.IsString(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    class_validator_1.IsString(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    class_validator_1.Length(users_constants_1.USER_CONST.USERNAME_MIN_LENGTH, users_constants_1.USER_CONST.USERNAME_MAX_LENGTH),
    class_validator_1.IsString(),
    mongoose_1.Prop({
        type: String,
        trim: true,
        unique: true,
    }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    class_validator_1.Length(users_constants_1.USER_CONST.PASSWORD_MIN_LENGTH, users_constants_1.USER_CONST.PASSWORD_MAX_LENGTH),
    class_validator_1.IsString(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    class_validator_1.Length(users_constants_1.USER_CONST.PASSWORD_MIN_LENGTH, users_constants_1.USER_CONST.PASSWORD_MAX_LENGTH),
    class_validator_1.IsString(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], User.prototype, "passwordConfirm", void 0);
__decorate([
    mongoose_1.Prop(mongoose_1.raw({
        id: {
            type: String,
        },
    })),
    __metadata("design:type", Object)
], User.prototype, "facebook", void 0);
__decorate([
    mongoose_1.Prop(mongoose_1.raw({
        id: {
            type: String,
        },
    })),
    __metadata("design:type", Object)
], User.prototype, "google", void 0);
__decorate([
    mongoose_1.Prop(mongoose_1.raw({
        id: {
            type: String,
        },
    })),
    __metadata("design:type", Object)
], User.prototype, "github", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Boolean)
], User.prototype, "isThirdParty", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], User.prototype, "jti", void 0);
__decorate([
    mongoose_1.Prop(mongoose_1.raw([{
            roomId: {
                type: String
            },
            time: {
                type: Date
            }
        }])),
    __metadata("design:type", Array)
], User.prototype, "lastJoining", void 0);
User = __decorate([
    mongoose_1.Schema({
        collection: exports.USER_MODEL,
        toJSON: { virtuals: true }
    })
], User);
exports.User = User;
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
exports.UserSchema.methods.comparePassword = async function comparePassword(password) {
    return bcrypt.compare(password, this.password);
};
exports.UserSchema.methods.checkPasswordConfirm = function checkPasswordConfirm() {
    return this.get('password') === this.get('passwordConfirm');
};
//# sourceMappingURL=user.entity.js.map