FROM node:24-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 8000

CMD [ "node", "src/index.js" ]