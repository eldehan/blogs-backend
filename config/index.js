import dotenv from 'dotenv'

process.env.NODE_ENV = process.env.NODE_ENV || 'DEV'
const env = process.env.NODE_ENV.toUpperCase()

const envFound = dotenv.config()

if (envFound.error) {
  throw new Error('No .env file found')
}

export default {
  port: parseInt(process.env.PORT, 10),
  logs: {
    morgan: process.env.MORGAN
  },
  mongo: process.env[env + '_DB_URI'],
  secretOrKey: process.env.SECRET
}