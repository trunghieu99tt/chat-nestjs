import { IsNotEmpty, IsString, Matches, maxLength, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDTO {

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    password: string;
}