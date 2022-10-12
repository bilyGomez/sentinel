const axios = require("axios");

//url of the incoming Webhook
const WebhookURL = process.env.MATTERMOST_WEBHOOK;

const sendPost = async (data)=>{

    var config = {
    method: 'post',
    url: WebhookURL,
    headers: { 
        'Content-Type': 'application/json'
    },
    data : data
    };

    await axios(config)
    .then(function (response) {
        console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
    console.log(error);
    });

};

const searchUser = async (term) =>{

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
        .then(function (response) {
            username = response.data[0].username;
        })
        .catch(function (error) {
        console.log(error);
        });
        return username;

}

module.exports = {sendPost, searchUser};