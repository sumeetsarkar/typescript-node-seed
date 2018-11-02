FROM node:8.12.0-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

RUN chmod +x /usr/src/app/start.sh
CMD "/usr/src/app/start.sh"
