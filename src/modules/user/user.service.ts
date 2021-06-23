import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDTO } from './dto/user.dto';
import { User, UserDocument } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { UserUpdateDTO } from './dto/user-update.dto';
import { UploadTool } from 'src/common/tool/upload.tool';
import { SMTPMailer } from 'src/config/mailer';
import { EmailTool } from 'src/common/tool/email.tool';
import { AuthToolService } from '../tool/auth-tool/auth-tool.service';
import { ResponseDTO } from 'src/common/dto/response.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private readonly authToolService: AuthToolService
    ) { }

    async createUser(userDto: UserDTO | User): Promise<User> {
        const createdUser = new this.userModel(userDto);
        if (!createdUser.checkPasswordConfirm()) {
            throw new BadRequestException("Password must match!");
        }

        // If we login using google/github/facebook, we dont' have password or password confirm
        if (createdUser.password && createdUser.passwordConfirm) {
            createdUser.password = await bcrypt.hash(userDto.password, 10);
            createdUser.passwordConfirm = null;
        }
        try {
            await createdUser.save();
            return createdUser;
        } catch (error) {
            throw new BadRequestException("Duplicate username");
        }
    }

    async findByUsername(username: string): Promise<UserDocument> {
        return this.userModel.findOne({
            username
        }).exec();
    }

    async findById(id: string): Promise<UserDocument> {
        return this.userModel.findById(id).exec();
    }

    async findByEmail(email: string): Promise<UserDocument> {
        return this.userModel.findOne({ email }).exec();
    }

    async findByGoogleID(id: string): Promise<UserDocument> {
        return this.userModel.findOne({ "google.id": id }).exec();
    }

    async getProfile(id: string): Promise<any> {
        return await this.userModel.findById(id).lean().then(async (res: User) => ({ ...res }));
    }


    async updateProfile(oldUser: User, updatedUser: UserUpdateDTO, fileUpload: any): Promise<ResponseDTO> {
        if (fileUpload) {
            const uploadedFile = await UploadTool.resizeAndUploadSingle(fileUpload);
            updatedUser.photo = uploadedFile;
        } else {
            updatedUser.photo = oldUser.photo;
        }
        if (updatedUser.password) {
            updatedUser.password = await bcrypt.hash(updatedUser.password, 10);
        }

        try {
            const response = await this.userModel.findOneAndUpdate({ username: oldUser.username }, updatedUser, { new: true });
            return {
                data: response,
                message: "OK",
                statusCode: 200,
            };
        } catch (error) {
            throw new BadRequestException("Username does exist. Please choose another one!");
        }
    }

    async resetPassword(email: string) {
        const user = await this.findByEmail(email);
        if (!user) {
            throw new BadRequestException("Email doesn't exist");
        }
        const token = this.authToolService.randomToken(6);
        const newPassword = await bcrypt.hash(token, 10)
        await this.userModel.findOneAndUpdate({ email }, { password: newPassword }, { new: true });
        SMTPMailer.sendMail(
            user.email,
            "Quen mat khau",
            EmailTool.resetPasswordEmail(user.lastName + user.firstName, user.username, token),
        );
        return { success: true };
    }

}
