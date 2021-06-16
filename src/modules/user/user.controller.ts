import { Body, Controller, Get, HttpStatus, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MyTokenAuthGuard } from 'src/common/guards/token.guard';
import { UploadTool } from 'src/common/tool/upload.tool';
import { GetUser } from './decorator/get-user.decorator';
import { UserUpdateDTO } from './dto/user-update.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(private userService: UserService) { }

    @Get('/me')
    @UseGuards(MyTokenAuthGuard)
    getMe(@GetUser() user: User) {
        return {
            status: HttpStatus.OK,
            message: "Success",
            data: user
        }
    }

    @Patch('/update')
    @UseGuards(MyTokenAuthGuard)
    @UseInterceptors(FileInterceptor('photo', UploadTool.imageUpload))
    updateMe(@GetUser() oldUser: User, @Body() updatedUser: UserUpdateDTO, @UploadedFile() fileUpload: any): Promise<{ data: User, message: string, status: number }> {
        return this.userService.updateProfile(oldUser, updatedUser, fileUpload);
    }

    @Post('/forgot-password')
    async resetPassword(@Body('email') email: string) {
        return await this.userService.resetPassword(email);
    }

    @Get("/test")
    test() {
        return "hello from test";
    }
}
