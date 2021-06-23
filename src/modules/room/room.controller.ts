import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { MyTokenAuthGuard } from 'src/common/guards/token.guard';
import { GetUser } from '../user/decorator/get-user.decorator';
import { User } from '../user/user.entity';
import { RoomDTO } from './dto/create-room.dto';
import { RoomDocument } from './room.entity';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
    constructor(private readonly roomService: RoomService) { }

    @Get('/:id')
    getRoom(@Param('id') id: string) {
        return this.roomService.findById(id);
    }

    @Post()
    // @UseGuards(MyTokenAuthGuard)
    createRoom(@GetUser() user: User, @Body() roomDto: RoomDTO): Promise<RoomDocument> {
        return this.roomService.createRoom(roomDto, user);
    }

    @Patch('/:id')
    @UseGuards(MyTokenAuthGuard)
    updateRoom(@GetUser() user: User, @Body() updateRoomDto: RoomDTO, @Param('id') id: string) {
        return this.roomService.updateRoom(user, id, updateRoomDto);
    }
}

