import { createServer } from "../app"
import request from 'supertest'

let app

beforeAll(async () => {
  app = await createServer()
  return app
})

describe("GET /health", () => {
  it("it should return 'OK' from the health check and database should be up", async () => {
    const res = await request(app).get("/health")
    expect(res.statusCode).toBe(200)
    expect(res._body.message).toBe('OK')
    expect(res._body.databaseUp).toBe(true)
  })
})