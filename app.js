import express from 'express'
import config from './config/index.js'

async function startServer() {
  const app = express();

  (await import('./loaders/index.js')).default({ app })

  app.listen(config.port, () => console.log(`server running on port ${config.port}`))
    .on('error', error => {
      console.log(error.message)
      process.exit(1)
    })
}

startServer()