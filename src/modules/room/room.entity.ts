import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsString } from "class-validator";
import { Message, MESSAGE_MODEL } from "../message/message.entity";
import { User, USER_MODEL } from "../user/user.entity";
import * as mongoose from 'mongoose';

export const ROOM_MODEL = "room";

@Schema({
    collection: ROOM_MODEL,
    toJSON: {
        virtuals: true,
    }
})
export class Room {
    _id?: string;

    @IsString()
    @Prop()
    name: string;

    @IsString()
    @Prop()
    description: string;

    @IsString()
    @Prop()
    image: string;

    @Prop({
        default: new Date()
    })
    createdAt: Date

    @Prop({
        default: new Date()
    })
    updatedAt: Date;

    @Prop()
    isPrivate: boolean;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    owner: User;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Message.name }] })
    messages: Message[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }] })
    members: User[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);

export type RoomDocument = Room & Document;
