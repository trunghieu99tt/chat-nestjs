/// <reference types="mongoose" />
export declare class SystemInfo {
    indentityValidate: boolean;
    emailValidate: boolean;
    thirdPartyAuth: boolean;
}
export declare const SystemInfoSchema: import("mongoose").Schema<import("mongoose").Document<SystemInfo, any>, import("mongoose").Model<any, any, any>, undefined>;
export declare const USER_MODEL = "users";
export declare class User {
    _id: string;
    firstName: string;
    lastName: string;
    photo: string;
    bio: string;
    phone: string;
    email: string;
    username: string;
    password: string;
    passwordConfirm: string;
    facebook: {
        id: string;
    };
    google: {
        id: string;
    };
    github: {
        id: string;
    };
    isThirdParty: boolean;
    jti: string;
    lastJoining: {
        roomId: string;
        time: Date;
    }[];
    comparePassword: (password: string) => Promise<boolean>;
    checkPasswordConfirm: () => boolean;
}
export declare const UserSchema: import("mongoose").Schema<import("mongoose").Document<User, any>, import("mongoose").Model<any, any, any>, undefined>;
export declare type UserDocument = User & Document;
