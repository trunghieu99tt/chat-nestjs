/// <reference types="mongoose" />
export declare class Token {
    _id: string;
    key: string;
    expAt: number;
    createdAt: number;
}
export declare const TokenSchema: import("mongoose").Schema<import("mongoose").Document<Token, any>, import("mongoose").Model<any, any, any>, undefined>;
export declare type TokenDocument = Token & Document;
