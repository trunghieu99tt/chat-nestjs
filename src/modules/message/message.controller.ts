import { Body, Controller, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MyTokenAuthGuard } from 'src/common/guards/token.guard';
import { UploadTool } from 'src/common/tool/upload.tool';
import { GetUser } from '../user/decorator/get-user.decorator';
import { User } from '../user/user.entity';
import { CreateMessageDTO } from './dto/create-message.dto';
import { MessageDocument } from './message.entity';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {

    constructor(private readonly messageService: MessageService) { }

    @Post('/:roomId')
    @UseGuards(MyTokenAuthGuard)
    @UseInterceptors(FileInterceptor('image', UploadTool.imageUpload))
    createMessage(@GetUser() user: User, @Body() createMessageDto: CreateMessageDTO, @UploadedFile() fileUpload: any, @Param('roomId') roomId: string): Promise<MessageDocument> {
        return this.messageService.createMessage(user, createMessageDto, roomId, fileUpload);
    }

}
