export default ({boundary, logger, entityMapper}) => {
    return [
        {
            resource: "/",
            behaviors: [
                {endpoint: "/", method: "get", behavior: [(req, res, next) => res.send("Hello World")]},
            ]
        }]
};
  