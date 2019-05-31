import createError from 'http-errors'

const errorHandler = logger => (error, req, res, next) => {
  logger.error (error);
  const { status, message } = createError(error.status || 500);
  res.status(status).json({ message });
};

export default errorHandler;
