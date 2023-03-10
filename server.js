import { createServer } from "./app.js"
import config from './config/index.js'

const app = await createServer()

app.listen(config.port, () => console.log(`server running on port ${config.port}`))
  .on('error', error => {
    console.log(error.message)
    process.exit(1)
  })