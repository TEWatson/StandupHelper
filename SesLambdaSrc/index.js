'use strict'

const dynasty = require('dynasty')({});
const standupUpdatesTable = dynasty.table('Standup-Updates');

exports.handler = function(event, context, callback) {
    var sesNotification = event.Records[0].ses;
    var sender = sesNotification.mail.source;
    var content = sesNotification.content
    console.log(sender)
    console.log(content)
    standupUpdatesTable
        .update({hash: sender}, {content: content})
        .then(function(resp) {
            console.log(resp);
        })
    callback(null, {'disposition':'CONTINUE'});
}