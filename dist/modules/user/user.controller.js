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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const token_guard_1 = require("../../common/guards/token.guard");
const upload_tool_1 = require("../../common/tool/upload.tool");
const get_user_decorator_1 = require("./decorator/get-user.decorator");
const user_update_dto_1 = require("./dto/user-update.dto");
const user_entity_1 = require("./user.entity");
const user_service_1 = require("./user.service");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    getMe(user) {
        return {
            status: common_1.HttpStatus.OK,
            message: "Success",
            data: user
        };
    }
    updateMe(oldUser, updatedUser, fileUpload) {
        return this.userService.updateProfile(oldUser, updatedUser, fileUpload);
    }
    async resetPassword(email) {
        return await this.userService.resetPassword(email);
    }
};
__decorate([
    common_1.Get('/me'),
    common_1.UseGuards(token_guard_1.MyTokenAuthGuard),
    __param(0, get_user_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getMe", null);
__decorate([
    common_1.Patch('/update'),
    common_1.UseGuards(token_guard_1.MyTokenAuthGuard),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('photo', upload_tool_1.UploadTool.imageUpload)),
    __param(0, get_user_decorator_1.GetUser()), __param(1, common_1.Body()), __param(2, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, user_update_dto_1.UserUpdateDTO, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateMe", null);
__decorate([
    common_1.Post('/forgot-password'),
    __param(0, common_1.Body('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "resetPassword", null);
UserController = __decorate([
    common_1.Controller('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map