#!/usr/bin/env bash
./zip-alexa.sh
aws lambda update-function-code --function-name StandupHelperImpl --zip-file fileb://alexa.zip
