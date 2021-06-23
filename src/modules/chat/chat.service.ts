import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MessageDocument, MESSAGE_MODEL } from "../message/message.entity";
import { MessageService } from "../message/message.service";
import { RoomDocument, ROOM_MODEL } from "../room/room.entity";
import { RoomService } from "../room/room.service";

@Injectable()
export class ChatService {
    constructor(
        private readonly messageService: MessageService,
        private readonly roomService: RoomService
    ) { }



}