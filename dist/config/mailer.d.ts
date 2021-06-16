declare class Mailer {
    private readonly logger;
    private readonly transporter;
    sendMail(receiver: string, subject: string, text: string, senderName?: string): void;
    sendMails(receivers: string[], subject: string, text: string): Promise<void>;
}
export declare const SMTPMailer: Mailer;
export {};
