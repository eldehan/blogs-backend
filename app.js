import express from 'express'
import appLoader from './loaders/index.js'

export async function createServer() {
  const app = express();
  await appLoader({ app })
  return app
}