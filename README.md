# Blogsite Backend Server

## Pre-requisites
- Install [Node.js](https://nodejs.org/en/)

## Getting started
- Clone the repository
```
git clone  https://github.com/eldehan/blogs-backend.git
```
- Install dependencies
```
cd blogs-backend
npm install
```
- Build and run the project
```
npm start
```
  Navigate to `http://localhost:3000`
  
### Npm Scripts

| Npm Script | Description |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| `start`                   | Runs node on server.js. Can be invoked with `npm start`                  |
| `dev`                   | Runs server.js with the nodemon wrapper, automatically restarting the node application when file changes in the directory are detected. Can be invoked with `npm dev`                                         |
| `test`                    | Runs tests using jest        |

### Project Structure
Folder structure of this app is explained below:

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **node_modules**         | Contains all npm dependencies                                                            |
| **config**               | Files for configuring environment variables and passport-jwt                              |
| **db**                   | Mongoose models which define schema which will be used when storing and retrieving data from the database | 
| **loaders**              | Files required for the initialization of specific pieces of server functionality, e.g. Mongo and Express loaders |
| **routes**              | Files detailing how API handles incoming HTTP requests |  
| **routes/blogsite**      | All routes that interface directly with the frontend blogsite, divided into the routes of /users and /blogs |
| **routes/healthcheck**           | Route for checking the status of the server                       
| **routes/middlewares**           | Middlewares which provide common functionality to all routes |
| **services**       | Supplementary business logic, including validating inputs and registering a user |
| **tests**       | Tests to verify API endpoints functioning properly |
| app.js         | Returns server object |
| server.js         | Starts server |
| package.json             | a manifest that stores information about the application, modules, packages, etc.  |
| .env | stores environment variables |

### Environment variables
This project uses the following environment variables, which should be stored in a .env file in the root directory:

| Name                          | Description                         | Default Value                                  |
| ----------------------------- | ------------------------------------| -----------------------------------------------|
|PORT           | Port the server will listen on            | "3000"      |
|MORGAN           | Format Morgan should use for logging            | "dev"      |
|SECRET           | String or buffer containing the secret (symmetric) or PEM-encoded public key (asymmetric) for verifying the token's signature            | N/A - Can be any string      |       
|DEV_DB_URI           | MongoDB Connection String URI to use in development environment            | N/A - need your own URI     |
|PRODUCTION_DB_URI           | MongoDB Connection String URI to use in production environment            | N/A - need your own URI      |
|TEST_DB_URI | MongoDB Connection String URI for use with tests | N/A - need your own URI |

## Testing
Tests are  written with Jest.

### Example - healthcheck.test.js
```
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

```
### Running tests using NPM Scripts
````
npm test

````

# Server Endpoints

API endpoints are detailed below.

## Health

### Check status of server and database connection

#### Request
`GET /health/`

#### Response
`HTTP/1.1 200 OK`

Response Body:
```
{
    "message": "OK",
    "uptime": 5.613286875,
    "databaseUp": true,
    "timestamp": 1678509707697
}
```

## Users

### Register a new user

#### Request
`POST blog-site/users/register`

Request Body:
```
{
    "username": (string)
    "email": (string)
    "password": (string)
    "passwordConfirmation": (string, must match password)
}
```

#### Response
`HTTP/1.1 200 OK`

Response Body:
```
{
    "status": "success",
    "data": {
        "id": "640c0b7eed360e2c4fd448c5"
    },
    "message": "Registration successful"
}
```

### Login

#### Request
`POST blog-site/users/login`

Request Body:
```
{
    "email": (string)
    "password": (string)
}
```

#### Response
`HTTP/1.1 200 OK`

Response Body:
```
{
    "status": "success",
    "data": {
        "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MGMwYjdlZWQzNjBlMmM0ZmQ0NDhjNSIsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJlbWFpbCI6InRlc3RlbWFpbEBmYWtlZW1haWwuY29tIiwiaWF0IjoxNjc4NTExMjU1LCJleHAiOjE2ODExNDA5OTl9.RF1MTSvm89ijlQLOlJC0y048PKBhbEgf4mybm7lAVg0"
    },
    "message": "Login successful"
}
```

### Get a user by username

#### Request
`GET blog-site/users/:username`

#### Response
`HTTP/1.1 200 OK`

Response Body:
```
{
    "status": "success",
    "data": {
        "username": "testuser",
        "date": "2023-03-11T05:02:54.864Z",
        "id": "640c0b7eed360e2c4fd448c5"
    },
    "message": "User found"
}
```

## Blogs

### Get all posts

#### Request
`GET blog-site/blogs/`

#### Response
`HTTP/1.1 200 OK`

Response Body:
```
{
    "status": "success",
    "data": [
        {
            "title": "Sample Post",
            "content": "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
            "author": {
                "email": "test@test.com",
                "date": "2023-03-05T05:27:12.210Z",
                "username": "testUser",
                "id": "640428305ea74a9d20aeece7"
            },
            "created_at": "2023-03-10T23:14:03.184Z",
            "updated_at": "2023-03-10T23:14:03.184Z",
            "id": "640bb9bb505c625108ba4f5a"
        },
        {
            "title": "Another Sample Post",
            "content": "Some content",
            "author": {
                "email": "anotheremail@test.com",
                "date": "2023-03-07T22:27:52.755Z",
                "username": "anotherTestUser",
                "id": "6407ba687a7d22e1f28dd524"
            },
            "created_at": "2023-03-10T23:14:03.184Z",
            "updated_at": "2023-03-10T23:14:03.184Z",
            "id": "6407bad27a7d22e1f28dd52b"
        }
    ],
    "message": "Blogs retrieved"
}
```

## Get one blog post by id

#### Request
`GET blog-site/blogs/:blogId`

#### Response
`HTTP/1.1 200 OK`

Response Body:
```
{
    "status": "success",
    "data": {
            "title": "Sample Post",
            "content": "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
            "author": {
                "email": "test@test.com",
                "date": "2023-03-05T05:27:12.210Z",
                "username": "testUser",
                "id": "640428305ea74a9d20aeece7"
            },
            "created_at": "2023-03-10T23:14:03.184Z",
            "updated_at": "2023-03-10T23:14:03.184Z",
            "id": "640bb9bb505c625108ba4f5a"
    },
    "message": "Blog retrieved"
}
```

## Create a new blog post

#### Request
`POST blog-site/blogs/`

Request Body:
```
{
    "title": (string)
    "content": (string, body of post)
    "img": (string, URL of image to attach to post, OPTIONAL)
    "author": (userID of author)
}
```

#### Response
`HTTP/1.1 201 Created`

Response Body:
```
{
    "status": "success",
    "data": {
        "title": "test post",
        "content": "this is a long post, just trust me on that",
        "author": "640428305ea74a9d20aeece7",
        "created_at": "2023-03-11T05:44:43.400Z",
        "updated_at": "2023-03-11T05:44:43.400Z",
        "id": "640c154b72b73a2a89799316"
    },
    "message": "Blog post created"
}
```

## Update a blog post

#### Request
`PUT blog-site/blogs/:id`

Request Body (only provided fields will be updated - authorId is required and must be same as post author):
```
{
    "title": (string)
    "content": (string, body of post)
    "img": (string, URL of image to attach to post)
    "author": (userID of author)
}
```

#### Response
`HTTP/1.1 200 OK`

Response Body:
```
{
    "status": "success",
    "data": {
        "title": "new post title",
        "content": "this is a long post, just trust me on that",
        "author": "640428305ea74a9d20aeece7",
        "created_at": "2023-03-11T05:44:43.400Z",
        "updated_at": "2023-03-11T05:44:43.400Z",
        "img": "",
        "id": "640c154b72b73a2a89799316"
    },
    "message": "Blog post updated"
}
```

## Delete a blog post

#### Request
`DELETE blog-site/blogs/:id`

Request Body:
```
{
    "author": (userID of author)
}
```

#### Response
`HTTP/1.1 200 OK`

Response Body:
```
{
    "status": "success",
    "data": null,
    "message": "Blog deleted successfully"
}
```
