import { Global, Module } from "@nestjs/common";
import { AuthToolService } from "./auth-tool.service";

@Global()
@Module({
    providers: [AuthToolService],
    exports: [AuthToolService]
})
export class AuthToolModule { }