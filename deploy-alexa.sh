#!/usr/bin/env bash
./zip-helper.sh
aws lambda update-function-code --function-name StandupHelperImpl --zip-file fileb://helper.zip
