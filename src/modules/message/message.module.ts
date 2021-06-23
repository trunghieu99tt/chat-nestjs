import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageController } from './message.controller';
import { MessageSchema, Message } from './message.entity';
import { MessageService } from './message.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Message.name, schema: MessageSchema
            }])
    ],
    controllers: [MessageController],
    providers: [MessageService],
    exports: [MessageService]
})
export class MessageModule { }
