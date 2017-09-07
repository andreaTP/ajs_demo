#!/bin/sh
npm install
#browserify main.js -o out.js
while inotifywait -e close_write *.js; do browserify main.js -o out.js; done
