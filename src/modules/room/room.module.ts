import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageModule } from '../message/message.module';
import { RoomController } from './room.controller';
import { RoomSchema, Room } from './room.entity';
import { RoomService } from './room.service';

@Module({
	imports: [MongooseModule.forFeature([
		{
			name: Room.name,
			schema: RoomSchema
		}]),
		MessageModule,
		HttpModule
	],
	controllers: [RoomController],
	providers: [RoomService],
	exports: [RoomService]
})
export class RoomModule { }
