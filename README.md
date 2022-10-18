# Sentinel

Sentinel is a javascript/nodejs app that performs like a bot read a googlesheets and sends email and DM mattermost

## Installation

Use the package manager NPM to install Sentinel.

```bash
npm install
```

## Usage

```python
npm start
```

## enviroment variables

the app needs for some enviroment variables put together inside a env.file, the variables are

APP_EMAIL

APP_EMAIL_CLIENT_ID

APP_EMAIL_CLIENT_SECRET

APP_EMAIL_REDIRECT_URI

APP_EMAIL_REFRESH_TOKEN

MATTERMOST_WEBHOOK

SPREADSHEET_ID


## developer enviroment 
a mattermost db and mattermost server needs to be installed via Docker to get an enviroment development, these can be found here: https://developers.mattermost.com/integrate/getting-started/