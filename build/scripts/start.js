const logger = require('../lib/logger')

logger.info('Starting server...')
require('../../server/main').listen(8090, () => {
  logger.success('Server is running at http://localhost:8090')
})
