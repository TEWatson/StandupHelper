'use strict'

var aws = require('aws-sdk');
var s3 = new aws.S3({apiVersion: '2006-03-01'});
const dynasty = require('dynasty')({});
const parser = require('mailparser').simpleParser;
const standupUpdatesTable = dynasty.table('Standup-Updates');
const millisEighteenHours = 64800;

function ttl() {
    return (Math.floor(Date.now() / 1000) + millisEighteenHours)
}

exports.handler = function(event, context, callback) {
    var sender = 'Unknown';
    var content = '';

    var bucket = event.Records[0].s3.bucket.name;
    var key = event.Records[0].s3.object.key;

    var params = {
        Bucket: bucket,
        Key: key
    };

    // Get s3 object
    var s3GetPromise = s3.getObject(params).promise();
    s3GetPromise.then(function(emailObject) {
        console.log("s3 object: \n" + emailObject);

        // Parse raw MIME-format email
        parser(emailObject.Body)
            .then(function(parsedMail) {
                console.log("Parsed mail object: \n" + parsedMail);
                var rawSender = parsedMail.from.value[0].name;
                content = parsedMail.text;

                // Handle LastName, FirstName case
                if (rawSender.indexOf(",") > 0) {
                    var splitStringArray = rawSender.split(",")
                    sender = splitStringArray[1] + " " + splitStringArray[0]
                } else {sender = rawSender}

                // Store sender name and email body in Dynamo
                standupUpdatesTable
                    .update({hash: sender}, {content: content, ttl: ttl()})
                    .then(function(resp) {
                        console.log(resp);
                    });
            }).catch(function(parseError) {console.log(parseError);});


    }).catch(function(err) {
        console.log("s3 error: " + err);
    });

    callback(null, {'disposition':'CONTINUE'});
};
