"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
//require("dotenv").config();
const dotenv = __importStar(require("dotenv"));
//const { sendPost, searchUser} = require("./APIs/postMessage");
const postMessage_1 = require("./APIs/postMessage");
//const {sendMailbot} = require("./APIs/mailer");
const mailer_1 = require("./APIs/mailer");
//const {authorize} = require("./utils/googleAuth");
const googleAuth_1 = require("./utils/googleAuth");
//const spreadsheet = require("./APIs/spreadsheet");
const spreadsheet_1 = __importDefault(require("./APIs/spreadsheet"));
dotenv.config();
function sentinel() {
    return __awaiter(this, void 0, void 0, function* () {
        const auth = yield (0, googleAuth_1.authorize)();
        const range = 'Sheet1!A2:E';
        setInterval(() => __awaiter(this, void 0, void 0, function* () {
            const rows = yield (0, spreadsheet_1.default)(auth, range);
            //create an object of managers and its accounts
            let issues = [];
            rows.map((account) => {
                if (account[2] === "") {
                    //find manager in temporal data structure
                    const managerRecord = issues.findIndex((item) => (item === null || item === void 0 ? void 0 : item.managerName) === account[3]);
                    if (managerRecord < 0 || managerRecord === undefined) { //create new record
                        issues.push({
                            managerName: account[3],
                            managerEmail: account[4],
                            accounts: [
                                account[0]
                            ]
                        });
                    }
                    else { //add new account to a manager
                        issues[managerRecord].accounts.push(account[0]);
                    }
                }
            });
            //const from = '"Bily gomez" <bily.gomez@3pillarglobal.com>';
            const subject = 'You have issues with an account';
            //iterate over each manager and its accounts
            for (const issue of issues) {
                const username = yield (0, postMessage_1.searchUser)(issue.managerEmail);
                var data = JSON.stringify({
                    "channel": `@${username}`,
                    "username": "test-automation",
                    "icon_url": "https://media-exp1.licdn.com/dms/image/C4E0BAQHyL-TC-5JP9A/company-logo_200_200/0/1519902944604?e=2147483647&v=beta&t=8ubgQkSyAGOYS8JGVoJr7LAiGy6o8BkEhaL0JdYQa3s",
                    "text": `#### Hi ${issue.managerName} \nplease review the following accounts.\n\n| Account  | Status                                   |\n|:-----------------------------------------------:|:-----------|\n${issue.accounts.map(account => "| " + account + "           | :warning:   |\n")}`.toString().replace(/,/gi, "")
                });
                const mailText = `<b>Hi ${issue.managerName} </b>it seems you have some issues with the account(s) <b>${issue.accounts.map(account => `${account} `)}</b> please review these status.<br/><br/> <small><i>mail sent automatically by 3PillarBot</i></small>`;
                console.log(issue.managerName);
                const mail = yield (0, mailer_1.sendMailbot)(issue.managerEmail, subject, mailText);
                const msg = yield (0, postMessage_1.sendPost)(data);
            }
        }), 7000);
    });
}
sentinel();
//# sourceMappingURL=index.js.map