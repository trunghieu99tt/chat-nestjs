import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
export declare class UploadTool {
    static imagePath: string;
    static multerFilter: (req: any, file: any, cb: any) => any;
    static imageUpload: MulterOptions;
    static uploadPhotoToServer: (file: any) => Promise<any>;
    static resizeImage: (file: any, width: any, height: any, format: any, quality: any) => Promise<void>;
    static resizeAndUploadSingle: (file: any, width?: number, height?: number, format?: string, quality?: number) => Promise<any>;
    static resizeAndUploadMulti: (files: any, width?: number, height?: number, format?: string, quality?: number) => Promise<any[]>;
}
