import { BadRequestException, HttpService, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseDTO } from 'src/common/dto/response.dto';
import { removeDuplicateObjectInArray } from 'src/common/utils/helper';
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
        await room.save();
    }

    async addMember(roomID: string, user: User) {
        const room = await this.findById(roomID);
        if (!room) {
            throw new NotFoundException("Room not found!");
        }
        const isInRoom = room.members.find((e: User) => e.username === user.username);
        if (isInRoom) {
            throw new BadRequestException("User's already in room!");
        }

        const roomMembers = removeDuplicateObjectInArray([...room.members, user._id]);
        room.members = roomMembers;

        await room.save();
    }

    async updateRoom(user: User, id: string, updateRoomDto: RoomDTO) {
        const room = await this.findById(id);
        if (!room) {
            throw new NotFoundException(`Room with ${id} not found!`);
        }
        if (room.owner._id.toString() !== user._id.toString()) {
            throw new UnauthorizedException("You do not have right to update this room!");
        }
        await this.roomModel.findByIdAndUpdate(id, updateRoomDto);
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
