'use strict'

var aws = require('aws-sdk');
var s3 = new aws.S3({apiVersion: '2006-03-01'});
const dynasty = require('dynasty')({});
const parser = require('mailparser').simpleParser;
const standupUpdatesTable = dynasty.table('Standup-Updates');

exports.handler = function(event, context, callback) {
    var sender = 'Unknown';
    var content = '';
    var rawEmail = '';

    var bucket = event.Records[0].s3.bucket.name;
    var key = event.Records[0].s3.object.key;
    console.log(bucket);

    var params = {
        Bucket: bucket,
        Key: key
    };

    var s3GetPromise = s3.getObject(params).promise();
    s3GetPromise.then(function(emailObject) {
        console.log("s3 object: \n" + emailObject);
        rawEmail = emailObject.Body
    }).catch(function(err) {
        console.log(err);
    });


    // Parse raw MIME-format email
    parser(rawEmail)
        .then(function(parsedMail) {
            console.log("Parsed mail object: \n" + parsedMail);
            if (parsedMail.headers.has('sender')) {
                sender = parsedMail.headers.get('sender');
            }
            content = parsedMail.text;
        }).catch(function(parseError) {console.log(parseError);});

    // Store sender name and email body in Dynamo
    standupUpdatesTable
        .update({hash: sender}, {content: content})
        .then(function(resp) {
            console.log(resp);
        });
    callback(null, {'disposition':'CONTINUE'});
};