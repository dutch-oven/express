# express

a production minded express boilerplate

## usage

Create an `index.js` with the contract like below:

```js
export default ({config, boundary, logger, messageHandler, entityMapper}) => [{
    resource: "/",
    behaviors: [
        {endpoint: "/", method: "get", behavior: [
            (req, res, next) => res.send("Hello World")
        ]},
    ]
}]
```

extend the dockerfile:

```dockerfile
FROM dutchoven/express

COPY package*.json /app/
RUN npm ci

COPY index.js /app/resources/
```
