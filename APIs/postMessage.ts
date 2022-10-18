const axios = require("axios");

interface WebHookResponse {
    data:string;
}

export interface SearchUserResponse {
    data: DataResponse[]
}

export interface DataResponse {
    id:                    string;
    create_at:             number;
    update_at:             number;
    delete_at:             number;
    username:              string;
    auth_data:             string;
    auth_service:          string;
    email:                 string;
    nickname:              string;
    first_name:            string;
    last_name:             string;
    position:              string;
    roles:                 string;
    locale:                string;
    timezone:              Timezone;
    disable_welcome_email: boolean;
}

export interface Timezone {
    automaticTimezone:    string;
    manualTimezone:       string;
    useAutomaticTimezone: string;
}


export const sendPost = async (data: string): Promise<void>=>{
    //url of the incoming Webhook
    const WebhookURL = process.env.MATTERMOST_WEBHOOK;

    var config = {
    method: 'post',
    url: WebhookURL,
    headers: { 
        'Content-Type': 'application/json'
    },
    data : data
    };

    await axios(config)
    .then(function (response: WebHookResponse ) {
        console.log(JSON.stringify(response.data));
    })
    .catch(function (error: any) {
    console.log(error);
    });

};

export const searchUser = async (term: string) =>{

    var data = JSON.stringify({
        "term":term
    });
    let username = '';
    
    var config = {
        method: 'post',
        url: 'http://localhost:8066/api/v4/users/search',//url of the server api
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 6obh3g84hpgsujzjgnp8ycr8mh'//access token created by login api or a bot token
        },
        data : data
        };
    
        await axios(config)
        .then(function (response: SearchUserResponse) {
            username = response.data[0].username;
        })
        .catch(function (error: any) {
        console.log(error);
        });
        return username;

}

//module.exports = {sendPost, searchUser};
