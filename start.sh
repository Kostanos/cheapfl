#!/bin/bash

if ! hash nodemon 2>/dev/null; then
  echo "Installing nodemon"
  npm install -g nodemon
fi
echo "Installing required modules"
npm install

echo "Starting server"
nodemon --delay 2 server.js
