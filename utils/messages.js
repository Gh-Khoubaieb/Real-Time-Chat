const moment = require("moment");

// function return the user and time in object to the server
function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mn a')
    }
}

module.exports = formatMessage;