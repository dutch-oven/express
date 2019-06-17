FROM alpine:3.9

WORKDIR /app

RUN apk update && apk upgrade && apk add npm nodejs

ENV PORT 80
ENV NODE_ENV production

COPY package*.json /app
RUN npm install

COPY . /app

CMD ./bin/www
