import { Logger, UnauthorizedException } from "@nestjs/common";
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
        const jwt = client.handshake.query.token;
        if (jwt) {
            const auth: any = await this.jwtService.verify(
                jwt
            );
            const { sub } = auth;
            const user = await this.userService.findById(sub);
            if (user) {
                const onlineUsers = this.connectedUsers.filter((userItem: User) => userItem._id.toString() !== user._id.toString());
                this.connectedUsers = onlineUsers;
            }
            this.server.emit('users', this.connectedUsers);
        }
    }


    async handleConnection(client: any, ...args: any[]) {
        const jwt = client.handshake.query.token;

        if (jwt) {

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
            Logger.debug("Connected")
            this.server.emit('users', this.connectedUsers);
            this.server.emit('rooms', this.rooms);
        }

    }


    @SubscribeMessage('addMessage')
    async handleMessage(@MessageBody() body: any) {
        Logger.debug("call addMessage")
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
        Logger.debug("call createRoom")
        const { username, channel } = body;
        const user = this.connectedUsers.find(e => e.username === username);
        const newRoom = await this.roomService.createRoom(channel, user);
        this.rooms = [
            ...this.rooms,
            newRoom
        ]
        this.server.emit('rooms', this.rooms);
    }

    @SubscribeMessage('joinRoom')
    async handleJoinRoom(@MessageBody() body: any) {
        Logger.debug("call joinRoom")
        const { username, roomID } = body;
        const user = this.connectedUsers.find((e: User) => e.username === username);
        await this.roomService.addMember(roomID, user);
        const publicRoom = await this.roomService.getRooms();
        const privateRoom = await this.roomService.getRooms(user);
        this.rooms = [
            ...publicRoom,
            ...privateRoom
        ]
        this.server.emit('rooms', this.rooms);
    }


    @SubscribeMessage('updateRoom')
    async handleUpdateRoom(@MessageBody() body: any) {
        Logger.debug("call updateRoom")
        const { username, channel } = body;
        const user = this.connectedUsers.find((e: User) => e.username === username);
        await this.roomService.updateRoom(user, channel._id, ({
            name: channel.name,
            description: channel.description,
            image: channel.image || '',
            isPrivate: channel.isPrivate || false
        }));
        const publicRoom = await this.roomService.getRooms();
        const privateRoom = await this.roomService.getRooms(user);
        this.rooms = [
            ...publicRoom,
            ...privateRoom
        ]
        this.server.emit('rooms', this.rooms);

    }

}