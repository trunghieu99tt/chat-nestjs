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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_entity_1 = require("./user.entity");
const bcrypt = require("bcryptjs");
const upload_tool_1 = require("../../common/tool/upload.tool");
const mailer_1 = require("../../config/mailer");
const email_tool_1 = require("../../common/tool/email.tool");
const auth_tool_service_1 = require("../tool/auth-tool/auth-tool.service");
const response_dto_1 = require("../../common/dto/response.dto");
let UserService = class UserService {
    constructor(userModel, authToolService) {
        this.userModel = userModel;
        this.authToolService = authToolService;
    }
    async createUser(userDto) {
        const createdUser = new this.userModel(userDto);
        if (!createdUser.checkPasswordConfirm()) {
            throw new common_1.BadRequestException("Password must match!");
        }
        if (createdUser.password && createdUser.passwordConfirm) {
            createdUser.password = await bcrypt.hash(userDto.password, 10);
            createdUser.passwordConfirm = null;
        }
        try {
            await createdUser.save();
            return createdUser;
        }
        catch (error) {
            throw new common_1.BadRequestException("Duplicate username");
        }
    }
    async findByUsername(username) {
        return this.userModel.findOne({
            username
        }).exec();
    }
    async findById(id) {
        return this.userModel.findById(id).exec();
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email }).exec();
    }
    async findByGoogleID(id) {
        return this.userModel.findOne({ "google.id": id }).exec();
    }
    async getProfile(id) {
        return await this.userModel.findById(id).exec();
    }
    async updateProfile(oldUser, updatedUser, fileUpload) {
        if (fileUpload) {
            const uploadedFile = await upload_tool_1.UploadTool.resizeAndUploadSingle(fileUpload);
            updatedUser.photo = uploadedFile;
        }
        else {
            updatedUser.photo = oldUser.photo;
        }
        if (updatedUser.password) {
            updatedUser.password = await bcrypt.hash(updatedUser.password, 10);
        }
        else {
            updatedUser.password = oldUser.password;
        }
        try {
            const response = await this.userModel.findOneAndUpdate({ username: oldUser.username }, updatedUser, { new: true });
            return {
                data: response,
                message: "OK",
                statusCode: 200,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException("Username does exist. Please choose another one!");
        }
    }
    async resetPassword(email) {
        const user = await this.findByEmail(email);
        if (!user) {
            throw new common_1.BadRequestException("Email doesn't exist");
        }
        const token = this.authToolService.randomToken(6);
        const newPassword = await bcrypt.hash(token, 10);
        await this.userModel.findOneAndUpdate({ email }, { password: newPassword }, { new: true });
        mailer_1.SMTPMailer.sendMail(user.email, "Quen mat khau", email_tool_1.EmailTool.resetPasswordEmail(user.lastName + user.firstName, user.username, token));
        return { success: true };
    }
    async updateLatestJoining(userId, roomId, time = new Date()) {
        const user = await this.findById(userId);
        const latestJoinings = (user === null || user === void 0 ? void 0 : user.lastJoining) || [];
        const idx = latestJoinings.findIndex((history) => {
            return history.roomId.toString() === roomId;
        });
        const newJoinTime = {
            roomId,
            time
        };
        if (idx !== -1) {
            latestJoinings[idx] = newJoinTime;
        }
        else {
            latestJoinings.push(newJoinTime);
        }
        user.lastJoining = latestJoinings;
        const response = await user.save();
        return response;
    }
};
UserService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel(user_entity_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        auth_tool_service_1.AuthToolService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map