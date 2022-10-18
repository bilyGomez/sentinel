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
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUser = exports.sendPost = void 0;
const axios = require("axios");
const sendPost = (data) => __awaiter(void 0, void 0, void 0, function* () {
    //url of the incoming Webhook
    const WebhookURL = process.env.MATTERMOST_WEBHOOK;
    var config = {
        method: 'post',
        url: WebhookURL,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };
    yield axios(config)
        .then(function (response) {
        console.log(JSON.stringify(response.data));
    })
        .catch(function (error) {
        console.log(error);
    });
});
exports.sendPost = sendPost;
const searchUser = (term) => __awaiter(void 0, void 0, void 0, function* () {
    var data = JSON.stringify({
        "term": term
    });
    let username = '';
    var config = {
        method: 'post',
        url: 'http://localhost:8066/api/v4/users/search',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 6obh3g84hpgsujzjgnp8ycr8mh' //access token created by login api or a bot token
        },
        data: data
    };
    yield axios(config)
        .then(function (response) {
        username = response.data[0].username;
    })
        .catch(function (error) {
        console.log(error);
    });
    return username;
});
exports.searchUser = searchUser;
//module.exports = {sendPost, searchUser};
//# sourceMappingURL=postMessage.js.map