const nodeMailer = require("nodemailer");
const {google} = require('googleapis');

const sendMailbot = async (to, subject, text) =>{
    
    const CLIENT_EMAIL = process.env.APP_EMAIL; //your email from where you'll be sending emails to users
    const CLIENT_ID = process.env.APP_EMAIL_CLIENT_ID; // Client ID generated on Google console cloud
    const CLIENT_SECRET = process.env.APP_EMAIL_CLIENT_SECRET; // Client SECRET generated on Google console cloud
    const REDIRECT_URI = process.env.APP_EMAIL_CLIENT_REDIRECT_URI; // The OAuth2 server (playground)
    const REFRESH_TOKEN = process.env.APP_EMAIL_REFRESH_TOKEN; // The refreshToken we got from the the OAuth2 playground

    const OAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    OAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN});
    try {
        // Generate the accessToken on the fly
        const accessToken = await OAuth2Client.getAccessToken();
        
        const transport = nodeMailer.createTransport({
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
            from: '"Bily gomez" <${CLIENT_EMAIL}>', // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            text: 'And this is a very important body', // plain text body
            html: text // html body
        };
        // Set up the email options and delivering it
        const result = await transport.sendMail(mailOptions);
        console.log(result.accepted, result.response);
    } catch (error) {
        console.log(error)        
    }

}
module.exports = {sendMailbot};