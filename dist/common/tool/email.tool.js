"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTool = void 0;
const user_entity_1 = require("../../modules/user/user.entity");
class EmailTool {
    static resetPasswordEmail(name, username, token) {
        return `<div style="text-align: justify; font-family: Helvetica; color: #404040;margin: 0 80px 0 80px; padding: 40 80 40 80; width:500px">
            <h3>Xin chào ${name}</h3>
            <p>Gần đây bạn đã yêu cầu thay đổi lại mật khẩu cho tài khoản: ${username}.</p>
            <p>Nếu đó là yêu cầu của bạn, hãy sử dụng mật khẩu tạm thời sau để đăng nhập vào tài khoản:</p> <h3>${token}</h3>
            <p>Mật khẩu này có hiệu lực trong vòng 5 ngày.</p>
            <p>Nếu đây không phải là yêu cầu của bạn, bạn có thể bỏ qua email này.</p>
        </div>`;
    }
}
exports.EmailTool = EmailTool;
//# sourceMappingURL=email.tool.js.map