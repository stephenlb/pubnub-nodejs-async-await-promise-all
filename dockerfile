from node:15.8.0-alpine3.10
copy package.json .
run npm install -g npm
run npm install
copy index.js .
cmd npm start
