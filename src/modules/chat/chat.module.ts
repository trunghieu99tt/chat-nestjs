import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { JWT_EXP, JWT_SECRET } from "src/common/config/secrets";
import { AuthModule } from "../auth/auth.module";
import { MessageSchema } from "../message/message.entity";
import { MessageModule } from "../message/message.module";
import { RoomSchema } from "../room/room.entity";
import { RoomModule } from "../room/room.module";
import { UserModule } from "../user/user.module";
import { ChatController } from './chat.controller';
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: "Message", schema: MessageSchema
            },
            {
                name: "Room",
                schema: RoomSchema
            }]),
        JwtModule.register({
            secret: JWT_SECRET,
            signOptions: {
                expiresIn: JWT_EXP
            }
        }),
        AuthModule,
        RoomModule,
        UserModule,
        MessageModule,
    ],
    controllers: [ChatController],
    providers: [ChatService, ChatGateway],
    exports: [ChatGateway],
})
export class ChatModule { };