import { UserService } from 'src/modules/user/user.service';
import { AuthToolService } from 'src/modules/tool/auth-tool/auth-tool.service';
export declare class GoogleStrategy {
    private readonly userService;
    private readonly authToolService;
    constructor(userService: UserService, authToolService: AuthToolService);
    init(): void;
}
