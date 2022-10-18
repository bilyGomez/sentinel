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
//const process = require('process');
const process_1 = __importDefault(require("process"));
//const {google} = require('googleapis');
const googleapis_1 = require("googleapis");
/**
* @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
*/
const readSpreadSheet = (auth, range) => __awaiter(void 0, void 0, void 0, function* () {
    const sheets = googleapis_1.google.sheets({ version: 'v4', auth });
    const res = yield sheets.spreadsheets.values.get({
        spreadsheetId: process_1.default.env.SPREADSHEET_ID,
        range: range, //the sheet and cell's range to read
    });
    const rows = res.data.values;
    if (!rows || rows.length === 0) {
        console.log('No data found.');
        return [];
    }
    else {
        return rows;
    }
});
exports.default = readSpreadSheet;
//module.exports = readSpreadSheet;
//# sourceMappingURL=spreadsheet.js.map