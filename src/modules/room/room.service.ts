import { HttpService, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseDTO } from 'src/common/dto/response.dto';
import { CreateMessageDTO } from '../message/dto/create-message.dto';
import { Message } from '../message/message.entity';
import { MessageService } from '../message/message.service';
import { User } from '../user/user.entity';
import { RoomDTO } from './dto/create-room.dto';
import { Room, RoomDocument } from './room.entity';

@Injectable()
export class RoomService {

    constructor(
        @InjectModel(Room.name)
        private readonly roomModel: Model<RoomDocument>,
        private readonly messageService: MessageService,
        private readonly httpService: HttpService
    ) { }

    async findById(id: string) {
        return await this.roomModel.findById(id).exec();
    }

    async createRoom(roomDto: RoomDTO, user: User): Promise<RoomDocument> {
        const newRoom = new this.roomModel({
            ...roomDto,
            owner: user,
            messages: [],
            members: [user],
            createdAt: new Date(),
            updatedAt: new Date(),
            isPrivate: false
        } as Room);
        return await newRoom.save();
    }

    async findByUserId(userID: string): Promise<RoomDocument[]> {
        return await this.roomModel.find({
            authorId: userID
        }).exec();
    }

    async addMessage(roomID: string, body: any, user: User, file: string | null = null) {

        const room = await this.findById(roomID);
        if (!room) {
            throw new NotFoundException("Room not found!");
        }
        const newMessage = await this.messageService.createMessage(user, body, roomID, file);

        room.messages.push(newMessage);
        const response = await room.save();
        return response;
    }

    async updateRoom(user: User, id: string, updateRoomDto: RoomDTO): Promise<ResponseDTO> {
        const room = await this.findById(id);
        if (!room) {
            throw new NotFoundException(`Room with ${id} not found!`);
        }
        if (room.owner._id !== user._id) {
            throw new UnauthorizedException("You do not have right to update this room!");
        }
        const response = await this.roomModel.findByIdAndUpdate(id, updateRoomDto, { new: true });

        return {
            data: response,
            statusCode: 204,
            message: "Success"
        }
    }

    async getRooms(owner: User | null = null) {
        const options = owner ? {
            isPrivate: true,
            owner
        } : {
            isPrivate: false
        };

        return await this.roomModel.find(options).populate({
            path: 'messages',
            populate:
            {
                path: 'author'
            }
        }).populate({
            path: 'owner'
        }).populate({
            path: 'members'
        }).exec();
    }

    async deleteRoom(id: string) {
        return await this.roomModel.findByIdAndDelete(id).exec();
    }
}
