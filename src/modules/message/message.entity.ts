import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsString } from "class-validator";
import { User } from "../user/user.entity";
import * as mongoose from 'mongoose';

export const MESSAGE_MODEL = "message";

@Schema({
    collection: MESSAGE_MODEL,
    toJSON: {
        virtuals: true
    }
})
export class Message {
    _id?: string;

    @IsString()
    @Prop()
    content: string;

    @Prop()
    file?: string;

    @Prop({
        default: new Date()
    })
    createdAt: Date

    @Prop()
    roomId: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    author: User

}

export const MessageSchema = SchemaFactory.createForClass(Message);

export type MessageDocument = Message & Document;
