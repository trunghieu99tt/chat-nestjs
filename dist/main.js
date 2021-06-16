"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const secrets_1 = require("./common/config/secrets");
async function bootstrap() {
    console.log(`SERVER_PORT`, secrets_1.SERVER_PORT);
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    await app.listen(process.env.SERVER_PORT || secrets_1.SERVER_PORT || 3020, '0.0.0.0');
}
bootstrap();
//# sourceMappingURL=main.js.map