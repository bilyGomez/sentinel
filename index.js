require("dotenv").config();
const { sendPost, searchUser} = require("./APIs/postMessage");
const {sendMailbot} = require("./APIs/mailer");
const {authorize} = require("./utils/googleAuth");
const spreadsheet = require("./APIs/spreadsheet");

async function sentinel() {
  const auth = await authorize();
  const range = 'Sheet1!A2:E';

  setInterval(async () =>{
    
    const rows = await spreadsheet(auth, range);
    //create an object of managers and its accounts
    let issues = [];
    rows.map((account) => {
      if(account[2] === ""){
        
        //find manager in temporal data structure
        const managerRecord = issues.findIndex((item) => item?.managerName === account[3]);

        if(managerRecord < 0 || managerRecord === undefined){//create new record
          issues.push({
            managerName:account[3],
            managerEmail:account[4],
            accounts:[
              account[0]
            ]
          })          
        }else{//add new account to a manager
          issues[managerRecord].accounts.push(account[0]);
        }
      }
    });
    
    //const from = '"Bily gomez" <bily.gomez@3pillarglobal.com>';
    const subject = 'You have issues with an account';
    
    //iterate over each manager and its accounts
    for(const issue of issues){

      const username = await searchUser(issue.managerEmail);
      
      var data = JSON.stringify({
        "channel": `@${username}`,
        "username": "test-automation",
        "icon_url": "https://media-exp1.licdn.com/dms/image/C4E0BAQHyL-TC-5JP9A/company-logo_200_200/0/1519902944604?e=2147483647&v=beta&t=8ubgQkSyAGOYS8JGVoJr7LAiGy6o8BkEhaL0JdYQa3s",
        "text": `#### Hi ${issue.managerName} \nplease review the following accounts.\n\n| Account  | Status                                   |\n|:-----------------------------------------------:|:-----------|\n${issue.accounts.map(account => "| "+account+"           | :warning:   |\n")}`.toString().replace(/,/gi,"")
        });
        
        const mailText = `<b>Hi ${issue.managerName} </b>it seems you have some issues with the account(s) <b>${issue.accounts.map(account => `${account} `)}</b> please review these status.<br/><br/> <small><i>mail sent automatically by 3PillarBot</i></small>`;
        console.log(issue.managerName);
        const mail = await sendMailbot(issue.managerEmail, subject, mailText);
        const msg = await sendPost(data);
      
    }
  }, 7000);
  
}

sentinel();