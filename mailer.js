const nodeMailer = require("nodemailer");
const {oAuth2GetAccessToken} = require("./googleAuth");

const sendMailbot = async (to, subject, text) =>{
    
    const CLIENT_EMAIL = process.env.APP_EMAIL; //your email from where you'll be sending emails to users
    const CLIENT_ID = process.env.APP_EMAIL_CLIENT_ID; // Client ID generated on Google console cloud
    const CLIENT_SECRET = process.env.APP_EMAIL_CLIENT_SECRET; // Client SECRET generated on Google console cloud
    const REFRESH_TOKEN = process.env.APP_EMAIL_REFRESH_TOKEN; // The refreshToken we got from the the OAuth2 playground
    
    try {
        // Generate the accessToken on the fly
        const accessToken = await oAuth2GetAccessToken();
        
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