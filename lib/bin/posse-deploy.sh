#!/bin/bash

yarn ts-node ./src/scripts/build.ts
S3=$(cat .s3) && aws s3 cp ./build/site $S3 --recursive
CLOUDFRONT=$(cat .cloudfront) && aws cloudfront create-invalidation --distribution-id \"$CLOUDFRONT\" --paths \"/*\"