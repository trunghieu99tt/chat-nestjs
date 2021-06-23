import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MyTokenAuthGuard } from 'src/common/guards/token.guard';
import { UploadTool } from 'src/common/tool/upload.tool';
import { User } from '../user/user.entity';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {

    constructor(private readonly uploadService: UploadService) { }

    @Post('/image')
    @UseGuards(MyTokenAuthGuard)
    @UseInterceptors(FileInterceptor('image', UploadTool.imageUpload))
    uploadImage(@UploadedFile() fileUpload: any): Promise<string> {
        return this.uploadService.uploadImage(fileUpload);
    }
}
