const process = require('process');
const {google} = require('googleapis');

/**
* @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
*/
const readSpreadSheet = async (auth,range) =>{
    
    const sheets = google.sheets({version: 'v4', auth});
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.SPREADSHEET_ID,//the id of the spreadsheet to read
        range: range,//the sheet and cell's range to read
    });

  const rows = res.data.values;

  if (!rows || rows.length === 0) {
    console.log('No data found.');
    return;
  }else{
    return rows;
  }

}

module.exports = readSpreadSheet;