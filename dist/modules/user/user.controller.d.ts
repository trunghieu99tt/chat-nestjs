import { HttpStatus } from '@nestjs/common';
import { ResponseDTO } from 'src/common/dto/response.dto';
import { UserUpdateDTO } from './dto/user-update.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getMe(user: User): {
        status: HttpStatus;
        message: string;
        data: User;
    };
    updateMe(oldUser: User, updatedUser: UserUpdateDTO, fileUpload: any): Promise<ResponseDTO>;
    resetPassword(email: string): Promise<{
        success: boolean;
    }>;
}
