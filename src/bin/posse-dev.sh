#!/bin/bash

nodemon -x 'yarn posse-build && http-server -c-1' --watch site --verbose -e html,css,md,jpg,jpeg,jfif,pjpeg,pjp,gif,svg,png,apng,avif,webp;