FROM node:17.5.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# RUN npm install --legacy-peer-deps
RUN npm install


COPY . .

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait

EXPOSE 4000 4001 4002 4003 4004

CMD /wait && npm start