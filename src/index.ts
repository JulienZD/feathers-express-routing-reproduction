import { app } from './app'
import { logger } from './logger'

const port = app.get('port') ?? 3031
const host = app.get('host') ?? 'localhost'

process.on('unhandledRejection', (reason, p) => logger.error('Unhandled Rejection at: Promise ', p, reason))

const server = app.listen(port)

server.on('listening', () => {
  logger.info(`Feathers app listening on http://${host}:${port}`)
})
