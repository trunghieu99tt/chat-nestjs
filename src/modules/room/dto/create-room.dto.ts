import { IsNotEmpty, IsString } from "class-validator";

export class RoomDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    isPrivate?: boolean;

    image?: string

}