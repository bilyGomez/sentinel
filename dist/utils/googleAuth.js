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
exports.oAuth2GetAccessToken = exports.authorize = void 0;
//const fs = require('fs').promises;
const fs = __importStar(require("fs/promises"));
//const path = require('path');
const path_1 = __importDefault(require("path"));
//const {authenticate} = require('@google-cloud/local-auth');
const local_auth_1 = require("@google-cloud/local-auth");
//const {google} = require('googleapis');
const googleapis_1 = require("googleapis");
//const process = require('process');
const process_1 = __importDefault(require("process"));
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path_1.default.join(process_1.default.cwd(), 'token.json');
const CREDENTIALS_PATH = path_1.default.join(process_1.default.cwd(), 'credentials.json');
/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
function loadSavedCredentialsIfExist() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const content = yield fs.readFile(TOKEN_PATH);
            const credentials = JSON.parse(content.toString());
            return googleapis_1.google.auth.fromJSON(credentials);
        }
        catch (err) {
            return null;
        }
    });
}
/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
function saveCredentials(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const content = yield fs.readFile(CREDENTIALS_PATH);
        const keys = JSON.parse(content.toString());
        const key = keys.installed || keys.web;
        const payload = JSON.stringify({
            type: 'authorized_user',
            client_id: key.client_id,
            client_secret: key.client_secret,
            refresh_token: client.credentials.refresh_token,
        });
        yield fs.writeFile(TOKEN_PATH, payload);
    });
}
/**
 * Load or request or authorization to call APIs.
 *
 */
const authorize = () => __awaiter(void 0, void 0, void 0, function* () {
    let client = yield loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = yield (0, local_auth_1.authenticate)({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        yield saveCredentials(client);
    }
    return client;
});
exports.authorize = authorize;
const oAuth2GetAccessToken = () => __awaiter(void 0, void 0, void 0, function* () {
    const CLIENT_ID = process_1.default.env.APP_EMAIL_CLIENT_ID; // Client ID generated on Google console cloud
    const CLIENT_SECRET = process_1.default.env.APP_EMAIL_CLIENT_SECRET; // Client SECRET generated on Google console cloud
    const REDIRECT_URI = process_1.default.env.APP_EMAIL_CLIENT_REDIRECT_URI; // The OAuth2 server (playground)
    const REFRESH_TOKEN = process_1.default.env.APP_EMAIL_REFRESH_TOKEN; // The refreshToken we got from the the OAuth2 playground
    const OAuth2Client = new googleapis_1.google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    OAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
    try {
        // Generate the accessToken on the fly
        const accessToken = yield OAuth2Client.getAccessToken();
        return accessToken;
    }
    catch (error) {
        console.log(error);
    }
});
exports.oAuth2GetAccessToken = oAuth2GetAccessToken;
//module.exports = {authorize, oAuth2GetAccessToken};
//# sourceMappingURL=googleAuth.js.map