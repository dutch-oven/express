FROM alpine:3.16

WORKDIR /app

RUN apk update && apk upgrade && apk add npm nodejs

ENV NODE_ENV production
ENV PORT 80

EXPOSE 80

COPY package*.json /app/

RUN npm ci && apk del npm

COPY . /app/

CMD ./bin/serve.js
