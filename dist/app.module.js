"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const auth_module_1 = require("./modules/auth/auth.module");
const user_module_1 = require("./modules/user/user.module");
const token_module_1 = require("./modules/token/token.module");
const auth_tool_module_1 = require("./modules/tool/auth-tool/auth-tool.module");
const message_module_1 = require("./modules/message/message.module");
const room_module_1 = require("./modules/room/room.module");
const upload_module_1 = require("./modules/upload/upload.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const configuration_1 = require("./config/configuration");
const secrets_1 = require("./common/config/secrets");
const chat_module_1 = require("./modules/chat/chat.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            config_1.ConfigModule.forRoot({
                load: [configuration_1.default]
            }),
            mongoose_1.MongooseModule.forRoot(secrets_1.MONGO_URI, {
                useUnifiedTopology: true,
                useNewUrlParser: true,
                useFindAndModify: false,
                useCreateIndex: true,
                retryDelay: 5000,
            }),
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            token_module_1.TokenModule,
            auth_tool_module_1.AuthToolModule,
            message_module_1.MessageModule,
            room_module_1.RoomModule,
            chat_module_1.ChatModule,
            upload_module_1.UploadModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map