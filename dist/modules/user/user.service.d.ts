import { Model } from 'mongoose';
import { UserDTO } from './dto/user.dto';
import { User, UserDocument } from './user.entity';
import { UserUpdateDTO } from './dto/user-update.dto';
import { AuthToolService } from '../tool/auth-tool/auth-tool.service';
import { ResponseDTO } from 'src/common/dto/response.dto';
export declare class UserService {
    private userModel;
    private readonly authToolService;
    constructor(userModel: Model<UserDocument>, authToolService: AuthToolService);
    createUser(userDto: UserDTO | User): Promise<User>;
    findByUsername(username: string): Promise<UserDocument>;
    findById(id: string): Promise<User & Document & import("mongoose").Document<any, any>>;
    findByEmail(email: string): Promise<UserDocument>;
    findByGoogleID(id: string): Promise<UserDocument>;
    getProfile(id: string): Promise<any>;
    updateProfile(oldUser: User, updatedUser: UserUpdateDTO, fileUpload: any): Promise<ResponseDTO>;
    resetPassword(email: string): Promise<{
        success: boolean;
    }>;
    updateLatestJoining(userId: string, roomId: string, time?: Date): Promise<User & Document & import("mongoose").Document<any, any>>;
}
