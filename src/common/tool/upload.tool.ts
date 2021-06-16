import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { exception } from "console";

const cloudinary = require("cloudinary").v2;
const sharp = require("sharp");
const fs = require("fs");
const multer = require('multer');

export class UploadTool {

    static imagePath: string = `/home/rikikudo/Code/Backend/NodeJS/auth-app/src/common/tool/upload`;


    static multerFilter = (req, file, cb) => {
        if (!file.mimetype.startsWith("image")) {
            return cb(
                new exception("Not an image! Please upload only images", 400),
                false
            );
        }
        cb(null, true);
    };

    static imageUpload: MulterOptions = {
        storage: multer.memoryStorage(),
        fileFilter: UploadTool.multerFilter,
    }

    static uploadPhotoToServer = async (file: any) => {
        try {
            const response = await cloudinary.uploader.upload(file);
            return response && response.secure_url;
        } catch (error) {
            console.log(`error uploadPhotoToServer`, error)
            return null;
        }
    };

    static resizeImage = async (file, width, height, format, quality) => {
        try {
            await sharp(file.buffer)
                .resize(width, height)
                .toFormat(format)
                .jpeg({ quality })
                .toFile(`${UploadTool.imagePath}/uploader.jpeg`);
        } catch (error) {
            console.log(`error resizeImage`, error)
        }
    };

    static resizeAndUploadSingle = async (
        file,
        width = 2000,
        height = 1333,
        format = "jpeg",
        quality = 90
    ) => {
        // First, resize image using sharp
        await UploadTool.resizeImage(file, width, height, format, quality);

        // When we have the file, save it to local storage
        const uploadResponse = await UploadTool.uploadPhotoToServer(
            `${UploadTool.imagePath}/uploader.${format}`
        );

        console.log(`uploadResponse resizeAndUploadSingle`, uploadResponse)

        // remove file in local machine
        fs.unlink(`${UploadTool.imagePath}/uploader.${format}`, (err) => {
            console.log("err", err);
        });
        return uploadResponse;
    };

    static resizeAndUploadMulti = async (
        files,
        width = 2000,
        height = 1333,
        format = "jpeg",
        quality = 90
    ) => {
        const imagesLink = [];

        await Promise.all(
            files.map(async (file) => {
                await UploadTool.resizeImage(file, width, height, format, quality);

                const uploadResponse = await UploadTool.uploadPhotoToServer(
                    `${UploadTool.imagePath}/uploader.${format}`
                );

                fs.unlink(`${UploadTool.imagePath}/uploader.${format}`, (err) => {
                    console.log("err", err);
                });

                imagesLink.push(uploadResponse);
            })
        );

        return imagesLink;
    };

}