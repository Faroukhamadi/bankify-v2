FROM node:16-alpine3.16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --legacy-peer-deps


COPY . .

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait

EXPOSE 4000 4001 4002 4003 4004

CMD /wait && npm start