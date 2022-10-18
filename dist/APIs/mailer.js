"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMailbot = void 0;
//const nodeMailer = require("nodemailer");
const nodemailer_1 = __importDefault(require("nodemailer"));
const { oAuth2GetAccessToken } = require("../utils/googleAuth");
const sendMailbot = (to, subject, text) => __awaiter(void 0, void 0, void 0, function* () {
    const CLIENT_EMAIL = process.env.APP_EMAIL; //your email from where you'll be sending emails to users
    const CLIENT_ID = process.env.APP_EMAIL_CLIENT_ID; // Client ID generated on Google console cloud
    const CLIENT_SECRET = process.env.APP_EMAIL_CLIENT_SECRET; // Client SECRET generated on Google console cloud
    const REFRESH_TOKEN = process.env.APP_EMAIL_REFRESH_TOKEN; // The refreshToken we got from the the OAuth2 playground
    try {
        // Generate the accessToken on the fly
        const accessToken = yield oAuth2GetAccessToken();
        const transport = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: CLIENT_EMAIL,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });
        let mailOptions = {
            from: '"Bily gomez" <${CLIENT_EMAIL}>',
            to: to,
            subject: subject,
            text: 'And this is a very important body',
            html: text // html body
        };
        // Set up the email options and delivering it
        const result = yield transport.sendMail(mailOptions);
        console.log(result.accepted, result.response);
    }
    catch (error) {
        console.log(error);
    }
});
exports.sendMailbot = sendMailbot;
//module.exports = {sendMailbot};
//# sourceMappingURL=mailer.js.map