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
exports.UserDTO = void 0;
const class_validator_1 = require("class-validator");
const users_constants_1 = require("../constants/users.constants");
class UserDTO {
}
__decorate([
    class_validator_1.IsString(),
    class_validator_1.MaxLength(users_constants_1.USER_CONST.NAME_MAX_LENGTH),
    __metadata("design:type", String)
], UserDTO.prototype, "firstName", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.MaxLength(users_constants_1.USER_CONST.NAME_MAX_LENGTH),
    __metadata("design:type", String)
], UserDTO.prototype, "lastName", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UserDTO.prototype, "photo", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UserDTO.prototype, "bio", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UserDTO.prototype, "phone", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UserDTO.prototype, "email", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    class_validator_1.MaxLength(users_constants_1.USER_CONST.NAME_MAX_LENGTH),
    __metadata("design:type", String)
], UserDTO.prototype, "username", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.MinLength(8),
    class_validator_1.MaxLength(20),
    class_validator_1.Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Password too weak'
    }),
    __metadata("design:type", String)
], UserDTO.prototype, "password", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.MinLength(8),
    class_validator_1.MaxLength(20),
    class_validator_1.Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Password too weak'
    }),
    __metadata("design:type", String)
], UserDTO.prototype, "passwordConfirm", void 0);
exports.UserDTO = UserDTO;
//# sourceMappingURL=user.dto.js.map