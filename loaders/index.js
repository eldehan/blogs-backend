import expressLoader from './express.js'
import mongoLoader from './mongo.js'

export default async function ({ app }) {
  await mongoLoader()
  console.log('Mongo loaded')

  await expressLoader({ app })
  console.log('Express loaded')
}
