# express

a production minded express boilerplate

## usage

Create an `index.js` with the contract like below:

```js
export default ({config, logger, boundary, messageHandler, cacheHandler, idManager, entityMapper}) => [{
    resource: "/",
    behaviors: [
        {endpoint: "/", method: "get", behavior: [(req, res, next) => res.send("Hello World")]},
    ]
}]
```
## contract

The values passed as each of the above keys are:

* ***logger***: the logger utility for the server. This might not work.
* ***boundary***: a simple utility for collapsing functions. This probably won't get used.
* ***idManager***: a small object for generating unique ids. current implementation is ulid.
* ***config***: any additional config that is loaded.

***the following items are passed as either a generator function or an instantiated object, depending on whether or not a config is provided***

* ***messageHandler***: reads and writes to an ephemeral message queue. current implementation is rabbit mq.
* ***cacheHandler***: reads from a cache appliance. current implementation is redis.
* ***entityMapper***: reads and writes to a relational database. currently a thin wrapper on knex.

## extension

```docker
FROM dutchoven/express

# install jq; <3 jq
RUN apk update && apk upgrade && apk add jq

# copy a config
COPY config.json /app/

# copy a resource definition
COPY index.js /app/src/resources/

# execute the application with the config
CMD ./bin/www $(jq -c . < config.json)
```
