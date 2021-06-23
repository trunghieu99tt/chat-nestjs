import { Injectable, UploadedFile } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UploadTool } from 'src/common/tool/upload.tool';
import { User } from '../user/user.entity';
import { CreateMessageDTO } from './dto/create-message.dto';
import { Message, MessageDocument } from './message.entity';

@Injectable()
export class MessageService {
    constructor(
        @InjectModel(Message.name)
        private readonly messageModel: Model<MessageDocument>
    ) { }

    async findById(id: string): Promise<MessageDocument> {
        return await this.messageModel.findById(id);
    }

    async createMessage(user: User, messageDto: CreateMessageDTO, roomId: string, file: string = ''): Promise<MessageDocument> {
        const message = new Message();
        message.author = user;
        message.roomId = roomId;
        message.createdAt = new Date();
        message.content = messageDto.content;

        if (file) {
            message.file = file;
        }



        const newMessage = new this.messageModel(message);
        const response = await newMessage.save();
        return response;
    }
}
