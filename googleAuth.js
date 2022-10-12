const fs = require('fs').promises;
const path = require('path');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
const process = require('process');
const { access } = require('fs');



// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
const authorize = async ()=> {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

const oAuth2GetAccessToken = async() =>{
  
  const CLIENT_ID = process.env.APP_EMAIL_CLIENT_ID; // Client ID generated on Google console cloud
  const CLIENT_SECRET = process.env.APP_EMAIL_CLIENT_SECRET; // Client SECRET generated on Google console cloud
  const REDIRECT_URI = process.env.APP_EMAIL_CLIENT_REDIRECT_URI; // The OAuth2 server (playground)
  const REFRESH_TOKEN = process.env.APP_EMAIL_REFRESH_TOKEN; // The refreshToken we got from the the OAuth2 playground

  const OAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
  OAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN});

  try {
    // Generate the accessToken on the fly
    const accessToken = await OAuth2Client.getAccessToken();
    return accessToken;
  } catch (error) {
    console.log(error)    
  }

}

module.exports = {authorize, oAuth2GetAccessToken};