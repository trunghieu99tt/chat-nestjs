import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Room } from "../room/room.entity";
import { RoomService } from "../room/room.service";
import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server;

    rooms: Room[] = [];
    connectedUsers: User[] = [];

    constructor(private jwtService: JwtService,
        private roomService: RoomService,
        private userService: UserService) {
    }



    async handleDisconnect(client: any) {
        console.log("Disconnected");
    }


    async handleConnection(client: any, ...args: any[]) {
        const jwt = client.handshake.query.token;
        const auth: any = await this.jwtService.verify(
            jwt
        );

        const { sub } = auth;
        const user = await this.userService.findById(sub);

        if (!user) {
            throw new UnauthorizedException();
        }


        const existedUser = this.connectedUsers.find((e: User) => {
            return JSON.stringify(user._id) == JSON.stringify(e._id);
        });
        if (!existedUser) {
            this.connectedUsers = [... new Set([
                ...this.connectedUsers,
                user
            ])];
        }

        const publicRoom = await this.roomService.getRooms();
        const privateRoom = await this.roomService.getRooms(user);
        this.rooms = [
            ...publicRoom,
            ...privateRoom
        ]
        this.server.emit('users', this.connectedUsers);
        this.server.emit('rooms', this.rooms);
    }


    @SubscribeMessage('addMessage')
    async handleMessage(@MessageBody() body: any) {
        const username = body.username;
        const user = this.connectedUsers.find(e => e.username === username);
        await this.roomService.addMessage(body.roomID, {
            content: body.content
        }, user, body.file);
        const publicRoom = await this.roomService.getRooms();
        const privateRoom = await this.roomService.getRooms(user);
        this.rooms = [
            ...publicRoom,
            ...privateRoom
        ]
        this.server.emit('rooms', this.rooms);
    }

    @SubscribeMessage('createRoom')
    async handleGetRoom(@MessageBody() body: any) {
        const { username, channel } = body;
        const user = this.connectedUsers.find(e => e.username === username);
        const newRoom = await this.roomService.createRoom(channel, user);
        this.rooms = [
            ...this.rooms,
            newRoom
        ]
        this.server.emit('rooms', this.rooms);
    }
}