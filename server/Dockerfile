FROM node:16-alpine3.15

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]