'use strict'

var aws = require('aws-sdk');
var s3 = new aws.S3({apiVersion: '2006-03-01'});
const dynasty = require('dynasty')({});
const parser = require('mailparser').simpleParser;
const standupUpdatesTable = dynasty.table('Standup-Updates');

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
                sender = parsedMail.from.value[0].name;
                content = parsedMail.text;

                // Store sender name and email body in Dynamo
                standupUpdatesTable
                    .update({hash: sender}, {content: content})
                    .then(function(resp) {
                        console.log(resp);
                    });
            }).catch(function(parseError) {console.log(parseError);});


    }).catch(function(err) {
        console.log("s3 error: " + err);
    });

    callback(null, {'disposition':'CONTINUE'});
};