import { createServer } from "../app"
import mongoose from 'mongoose'
import request from 'supertest'
import User from '../db/userModel.js'

let app

beforeAll(async () => {
  mongoose.connect(
    process.env.TEST_DB_URI,
    { useNewUrlParser: true },
  )

  app = await createServer()
  return app
})

afterAll(async () => {
  await User.deleteMany({ username: /.*testUser.*/i })
})

describe("GET /health", () => {
  it("it should return 'OK' from the health check and database should be up", async () => {
    const res = await request(app).get("/health")
    expect(res.statusCode).toBe(200)
    expect(res.body.message).toBe('OK')
    expect(res.body.databaseUp).toBe(true)
  })
})

describe("POST /blog-site/users/register", () => {
  const userData = {
    username: "testUser",
    email: "test@email.com",
    password: "testPassword",
    passwordConfirmation: "testPassword",
  }

  const userDataDupEmail = {
    username: "testUserDupEmail",
    email: "test@email.com",
    password: "testPassword",
    passwordConfirmation: "testPassword",
  }

  const userDataDupUsername = {
    username: "testUser",
    email: "newTest@email.com",
    password: "testPassword",
    passwordConfirmation: "testPassword",
  }

  const userDataWrongPasswordConfirm = {
    username: "testUserWrongPassword",
    email: "wrongPassword@email.com",
    password: "testPassword",
    passwordConfirmation: "thisDontMatch",
  }

  it("it should register a user when given valid registration info ", async () => {
    await request(app)
      .post("/blog-site/users/register")
      .send(userData)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.status).toBe('success')
        expect(response.body.data.id).toBeTruthy()
        expect(response.body.message).toBe('Registration successful')

        // Check the data in the database
        const newUser = await User.findOne({ _id: response.body.data.id })
        expect(newUser).toBeTruthy()
        expect(newUser.username).toBe(userData.username)
        expect(newUser.email).toBe(userData.email)
      })
  })

  it("it should return a 400 error if trying to register with a duplicate email", async () => {
    await request(app)
      .post("/blog-site/users/register")
      .send(userDataDupEmail)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.status).toBe('error')
        expect(response.body.data).toBeNull()
        expect(response.body.message).toBe('Email already exists')

        // Check the database and ensure there is only one user still
        const users = await User.find({ username: /.*testUser.*/i })
        expect(users.length).toBe(1)
      })
  })

  it("it should return a 400 error if trying to register with a duplicate username", async () => {
    await request(app)
      .post("/blog-site/users/register")
      .send(userDataDupUsername)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.status).toBe('error')
        expect(response.body.data).toBeNull()
        expect(response.body.message).toBe('Username already exists')

        // Check the database and ensure there is only one user still
        const users = await User.find({ username: /.*testUser.*/i })
        expect(users.length).toBe(1)
      })
  })

  it("it should return a 400 error if registering and password confirmation doesn't match", async () => {
    await request(app)
      .post("/blog-site/users/register")
      .send(userDataWrongPasswordConfirm)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.status).toBe('error')
        expect(response.body.data).toBeNull()
        expect(response.body.message).toBe('Passwords must match')

        // Check the database and ensure there is only one user still
        const users = await User.find({ username: /.*testUser.*/i })
        expect(users.length).toBe(1)
      })
  })
})

describe("POST /blog-site/users/login", () => {
  const loginData = {
    email: "test@email.com",
    password: "testPassword",
  }

  const loginDataWrongPassword = {
    email: "test@email.com",
    password: "thisIsTheWrongPassword",
  }

  const loginDataNonExistantUser = {
    email: "iDontExist@email.com",
    password: "testPassword",
  }

  it("it should return success when logging in with correct info", async () => {
    await request(app)
      .post("/blog-site/users/login")
      .send(loginData)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.status).toBe('success')
        expect(response.body.data).toBeTruthy()
        expect(response.body.message).toBe('Login successful')
      })
  })

  it("it should return a 400 error if trying to login with the wrong password", async () => {
    await request(app)
      .post("/blog-site/users/login")
      .send(loginDataWrongPassword)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.status).toBe('error')
        expect(response.body.data).toBeNull()
        expect(response.body.message).toBe('Password incorrect')
      })
  })

  it("it should return a 404 error if trying to login with an email that doesnt exist in db", async () => {
    await request(app)
      .post("/blog-site/users/login")
      .send(loginDataNonExistantUser)
      .expect(404)
      .then(async (response) => {
        // Check the response
        expect(response.body.status).toBe('error')
        expect(response.body.data).toBeNull()
        expect(response.body.message).toBe('Email not found')
      })
  })
})