#!/bin/bash

yarn posse-build
S3=$(cat .s3) && aws s3 cp ./public $S3 --recursive
CLOUDFRONT=$(cat .cloudfront) && aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT" --paths "/*"