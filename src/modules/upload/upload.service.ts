import { Injectable } from '@nestjs/common';
import { UploadTool } from 'src/common/tool/upload.tool';

@Injectable()
export class UploadService {
    async uploadImage(fileUpload: any): Promise<string> {
        let file = '';
        if (fileUpload) {
            file = await UploadTool.resizeAndUploadSingle(fileUpload);
        }
        return file;
    }

}
