import express from 'express'
import appLoader from './loaders/index.js'

export async function createServer() {
  const app = express();
  await appLoader({ app })
  // (await import('./loaders/index.js')).default({ app })
  return app
}



/*
export const start = async () => {
  try {
    await appLoader({ app, express });
    app.listen(appConfig.port, () => {
       
      console.log(`REST API on http://localhost:${appConfig.port}/api/v1`);
      console.log(process.env.MONGO_URI_DEV);
      console.log(appConfig.dbUrl);
      
    });
  } catch (e) {
    console.error(e)
  }
}
*/