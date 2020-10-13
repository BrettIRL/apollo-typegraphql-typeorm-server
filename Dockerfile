FROM node:12-alpine

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 4000:4000

CMD [ "yarn", "prod" ]