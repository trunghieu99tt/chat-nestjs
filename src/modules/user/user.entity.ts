import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsString, Length } from "class-validator";
import { USER_CONST } from "./constants/users.constants";
import * as bcrypt from "bcryptjs";

@Schema({})
export class SystemInfo {
    @Prop({
        type: Boolean,
        default: false,
    })
    indentityValidate: boolean;

    @Prop({
        type: Boolean,
        default: false,
    })
    emailValidate: boolean;

    @Prop({
        type: Boolean,
        default: false,
    })
    thirdPartyAuth: boolean;
}

export const SystemInfoSchema = SchemaFactory.createForClass(SystemInfo);

export const USER_MODEL = "users";
@Schema({
    collection: USER_MODEL,
    toJSON: { virtuals: true }
})
export class User {
    _id: string;

    @IsString()
    @Prop({
        type: String,
        required: false,
        trim: true,
        maxlength: USER_CONST.NAME_MAX_LENGTH
    })
    firstName: string;

    @IsString()
    @Prop({
        type: String,
        required: false,
        trim: true,
        maxlength: USER_CONST.NAME_MAX_LENGTH
    })
    lastName: string;

    @IsString()
    @Prop()
    photo: string;

    @IsString()
    @Prop()
    bio: string;

    @IsString()
    @Prop()
    phone: string;

    @IsString()
    @Prop()
    email: string;

    @Length(USER_CONST.USERNAME_MIN_LENGTH, USER_CONST.USERNAME_MAX_LENGTH)
    @IsString()
    @Prop({
        type: String,
        trim: true,
        unique: true,
    })
    username: string;

    @Length(USER_CONST.PASSWORD_MIN_LENGTH, USER_CONST.PASSWORD_MAX_LENGTH)
    @IsString()
    @Prop()
    password: string;

    @Length(USER_CONST.PASSWORD_MIN_LENGTH, USER_CONST.PASSWORD_MAX_LENGTH)
    @IsString()
    @Prop()
    passwordConfirm: string;

    @Prop(
        raw({
            id: {
                type: String,
            },
        }),
    )
    facebook: {
        id: string;
    };

    @Prop(
        raw({
            id: {
                type: String,
            },
        }),
    )
    google: {
        id: string;
    };

    @Prop(
        raw({
            id: {
                type: String,
            },
        }),
    )
    github: {
        id: string;
    };

    @Prop()
    isThirdParty: boolean

    @Prop()
    jti: string;


    @Prop(raw([{
        roomId: {
            type: String
        },
        time: {
            type: Date
        }
    }]))
    lastJoining: {
        roomId: string,
        time: Date
    }[];

    comparePassword: (password: string) => Promise<boolean>;
    checkPasswordConfirm: () => boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.comparePassword = async function comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, ((this as unknown) as User).password);
}

UserSchema.methods.checkPasswordConfirm = function checkPasswordConfirm(): boolean {
    return this.get('password') === this.get('passwordConfirm');
}

export type UserDocument = User & Document;
