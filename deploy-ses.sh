#!/usr/bin/env bash
./zip-ses.sh
aws lambda update-function-code --function-name EmailFilterAndStore --zip-file fileb://ses.zip
