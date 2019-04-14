import { createLogger, format, transports } from 'winston'

const logger = createLogger({
  exitOnError: false,
  format: format.json(),
  transports: [
    new transports.Console(),
  ]
})

logger.stream = {
  write: message => {
    logger.info(message)
  }
}

export default logger
