import { HttpStatus } from '@nestjs/common';
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
    updateMe(oldUser: User, updatedUser: UserUpdateDTO, fileUpload: any): Promise<{
        data: User;
        message: string;
        status: number;
    }>;
    resetPassword(email: string): Promise<{
        success: boolean;
    }>;
}
