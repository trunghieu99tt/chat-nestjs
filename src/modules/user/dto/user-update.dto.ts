import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { USER_CONST } from "../constants/users.constants";

export class UserUpdateDTO {

    @IsString()
    @MaxLength(USER_CONST.NAME_MAX_LENGTH)
    firstName?: string;

    @IsString()
    @MaxLength(USER_CONST.NAME_MAX_LENGTH)
    lastName?: string;

    photo?: string;

    @IsString()
    bio?: string;

    @IsString()
    phone: string;

    @IsString()
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Password too weak'
    })
    password: string;

}