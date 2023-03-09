import mongoose from 'mongoose'
import config from '../config/index.js'

export default async function () {
  const connection = await mongoose.connect(config.mongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  console.log(`MongoDB connected: ${connection.connection.host}`)
};