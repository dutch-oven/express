FROM alpine:3.9

WORKDIR /app
COPY . /app

RUN apk update && apk upgrade && apk add npm nodejs
RUN npm install

ENV PORT 80
ENV NODE_ENV production

CMD ./bin/www
