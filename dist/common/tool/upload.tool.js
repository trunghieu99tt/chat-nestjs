"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadTool = void 0;
const console_1 = require("console");
const secrets_1 = require("../config/secrets");
const cloudinary = require("cloudinary").v2;
const sharp = require("sharp");
const fs = require("fs");
const multer = require('multer');
class UploadTool {
}
exports.UploadTool = UploadTool;
UploadTool.imagePath = secrets_1.NODE_ENV === 'production' ? secrets_1.CLOUDINARY_PATH : secrets_1.CLOUDINARY_PATH_DEV;
UploadTool.multerFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith("image")) {
        return cb(new console_1.exception("Not an image! Please upload only images", 400), false);
    }
    cb(null, true);
};
UploadTool.imageUpload = {
    storage: multer.memoryStorage(),
    fileFilter: UploadTool.multerFilter,
};
UploadTool.uploadPhotoToServer = async (file) => {
    try {
        const response = await cloudinary.uploader.upload(file);
        return response && response.secure_url;
    }
    catch (error) {
        throw error;
    }
};
UploadTool.resizeImage = async (file, width, height, format, quality) => {
    try {
        await sharp(file.buffer)
            .resize(width, height)
            .toFormat(format)
            .jpeg({ quality })
            .toFile(`${UploadTool.imagePath}/uploader.jpeg`);
    }
    catch (error) {
        throw error;
    }
};
UploadTool.resizeAndUploadSingle = async (file, width = 2000, height = 2000, format = "jpeg", quality = 90) => {
    try {
        await UploadTool.resizeImage(file, width, height, format, quality);
        const uploadResponse = await UploadTool.uploadPhotoToServer(`${UploadTool.imagePath}/uploader.${format}`);
        fs.unlink(`${UploadTool.imagePath}/uploader.${format}`, (err) => {
            console.log("err", err);
        });
        return uploadResponse;
    }
    catch (error) {
        throw error;
    }
};
UploadTool.resizeAndUploadMulti = async (files, width = 2000, height = 1333, format = "jpeg", quality = 90) => {
    const imagesLink = [];
    await Promise.all(files.map(async (file) => {
        await UploadTool.resizeImage(file, width, height, format, quality);
        const uploadResponse = await UploadTool.uploadPhotoToServer(`${UploadTool.imagePath}/uploader.${format}`);
        fs.unlink(`${UploadTool.imagePath}/uploader.${format}`, (err) => {
            console.log("err", err);
        });
        imagesLink.push(uploadResponse);
    }));
    return imagesLink;
};
//# sourceMappingURL=upload.tool.js.map