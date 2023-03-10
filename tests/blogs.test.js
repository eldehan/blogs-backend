import { createServer } from "../app"
import mongoose from 'mongoose'
import request from 'supertest'
import Blog from '../db/blogModel.js'
import User from '../db/userModel.js'

let app

beforeAll(async () => {
  mongoose.connect(
    process.env.TEST_DB_URI,
    { useNewUrlParser: true },
  )

  const newUser = new User({
    username: "blogUser",
    email: "test@email.com",
    password: "testPassword"
  })

  await newUser.save()

  app = await createServer()
  return app
})

afterAll(async () => {
  await User.deleteOne({ username: /.*blogUser.*/i })
  await Blog.deleteMany({ title: /.*testBlog.*/i })
})

describe("POST /blog-site/blogs/", () => {

  it("it should return a new blog when posted with correct info", async () => {
    const blogUser = await User.findOne({ username: 'blogUser' })
    const userId = blogUser._id.toString()

    const blogData1 = {
      title: "testBlog1",
      content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. At deserunt reiciendis aliquam harum itaque aspernatur iste, numquam autem accusamus eaque!",
      authorId: userId
    }

    await request(app)
      .post("/blog-site/blogs")
      .send(blogData1)
      .expect(201)
      .then(async (response) => {
        // Check the response
        expect(response.body.status).toBe('success')
        expect(response.body.message).toBe('Blog post created')
        expect(response.body.data.id).toBeTruthy()
        expect(response.body.data.title).toBe(blogData1.title)
        expect(response.body.data.content).toBe(blogData1.content)

        // Check the data in the database
        const newBlog = await Blog.findOne({ _id: response.body.data.id })
        expect(newBlog).toBeTruthy()
        expect(newBlog.title).toBe(blogData1.title)
        expect(newBlog.content).toBe(blogData1.content)
      })
  })
})

describe("GET /blog-site/blogs/", () => {

  it("it should return all blogs", async () => {
    const blogUser = await User.findOne({ username: 'blogUser' })
    const userId = blogUser._id.toString()

    const anotherNewBlog = new Blog({
      title: "testBlogN",
      content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. At deserunt reiciendis aliquam harum itaque aspernatur iste, numquam autem accusamus eaque!",
      author: userId
    })

    await anotherNewBlog.save()

    await request(app)
      .get("/blog-site/blogs")
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.status).toBe('success')
        expect(response.body.message).toBe('Blogs retrieved')
        expect(response.body.data.length).toBeGreaterThan(1)
        expect(response.body.data).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ title: 'testBlogN' })
          ])
        )

        // Check the data in the database
        const blogs = await Blog.find({})
        expect(blogs.length).toBe(response.body.data.length)
      })
  })
})

describe("GET /blog-site/blogs/:id", () => {

  it("it should return the specified blog", async () => {
    const blogUser = await User.findOne({ username: 'blogUser' })
    const userId = blogUser.id

    const newBlog = new Blog({
      title: "testBlog2",
      content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. At deserunt reiciendis aliquam harum itaque aspernatur iste, numquam autem accusamus eaque!",
      author: userId
    })

    const savedBlog = await newBlog.save()
    const blogId = savedBlog.id

    await request(app)
      .get(`/blog-site/blogs/${blogId}`)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.status).toBe('success')
        expect(response.body.data.id).toBe(blogId)
        expect(response.body.data.title).toBe("testBlog2")
        expect(response.body.data.author.id).toBe(userId)
        expect(response.body.message).toBe('Blog retrieved')
      })
  })

  it("it should return a 400 error if invalid blogId given", async () => {
    await request(app)
      .get(`/blog-site/blogs/1`)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.status).toBe('error')
        expect(response.body.data).toBeNull()
        expect(response.body.message).toBe('Invalid blogId')
      })
  })

  it("it should return a 404 error if valid but nonexistent blogid given", async () => {
    await request(app)
      .get(`/blog-site/blogs/111111111111111111111111`)
      .expect(404)
      .then(async (response) => {
        // Check the response
        expect(response.body.status).toBe('error')
        expect(response.body.data).toBeNull()
        expect(response.body.message).toBe('Blog not found')
      })
  })
})

describe("PUT /blog-site/blogs/:id", () => {

  it("it should update a blog", async () => {
    const blogUser = await User.findOne({ username: 'blogUser' })
    const userId = blogUser._id.toString()

    const blogToUpdate = new Blog({
      title: "testBlogToUpdate",
      content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. At deserunt reiciendis aliquam harum itaque aspernatur iste, numquam autem accusamus eaque!",
      author: userId
    })

    const savedBlog = await blogToUpdate.save()
    const blogId = savedBlog.id

    await request(app)
      .put(`/blog-site/blogs/${blogId}`)
      .send({ content: 'updated string', author: userId })
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.status).toBe('success')
        expect(response.body.message).toBe('Blog post updated')
        expect(response.body.data.content).toBe('updated string')
        expect(response.body.data.id).toBe(blogId)

        // Check the data in the database
        const newBlog = await Blog.findOne({ _id: response.body.data.id })
        expect(newBlog).toBeTruthy()
        expect(newBlog.content).toBe('updated string')
      })
  })

  it("it should return a 404 error if provided userId is not author of post", async () => {
    const blogUser = await User.findOne({ username: 'blogUser' })
    const userId = blogUser._id.toString()

    const blogToFailUpdate = new Blog({
      title: "testBlogToUpdate",
      content: "this won't be updated",
      author: userId
    })

    const savedBlog = await blogToFailUpdate.save()
    const blogId = savedBlog.id

    await request(app)
      .put(`/blog-site/blogs/${blogId}`)
      .send({ content: 'updated string', author: '111111111111111111111111' })
      .expect(404)
      .then(async (response) => {
        // Check the response
        expect(response.body.status).toBe('error')
        expect(response.body.data).toBe(null)

        // Check the data in the database
        const oldBlog = await Blog.findOne({ _id: blogId })
        expect(oldBlog).toBeTruthy()
        expect(oldBlog.content).toBe("this won't be updated")
      })
  })
})

describe("DELETE /blog-site/blogs/:id", () => {

  it("it should delete a blog", async () => {
    const blogUser = await User.findOne({ username: 'blogUser' })
    const userId = blogUser._id.toString()

    const blogToDelete = new Blog({
      title: "testBlogToDelete",
      content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. At deserunt reiciendis aliquam harum itaque aspernatur iste, numquam autem accusamus eaque!",
      author: userId
    })

    const savedBlog = await blogToDelete.save()
    const blogId = savedBlog.id

    await request(app)
      .delete(`/blog-site/blogs/${blogId}`)
      .send({ author: userId })
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.status).toBe('success')
        expect(response.body.message).toBe('Blog deleted successfully')
        expect(response.body.data).toBe(null)

        // Check the data in the database
        const newBlog = await Blog.findOne({ _id: blogId })
        expect(newBlog).toBeFalsy()
      })
  })

  it("it should return a 404 error if provided userId is not author of post", async () => {
    const blogUser = await User.findOne({ username: 'blogUser' })
    const userId = blogUser._id.toString()

    const blogToFailDelete = new Blog({
      title: "testBlogToUpdate",
      content: "this won't be deleted",
      author: userId
    })

    const savedBlog = await blogToFailDelete.save()
    const blogId = savedBlog.id

    await request(app)
      .delete(`/blog-site/blogs/${blogId}`)
      .send({ author: '111111111111111111111111' })
      .expect(404)
      .then(async (response) => {
        // Check the response
        expect(response.body.status).toBe('error')
        expect(response.body.data).toBe(null)

        // Check the data in the database
        const oldBlog = await Blog.findOne({ _id: blogId })
        expect(oldBlog).toBeTruthy()
        expect(oldBlog.content).toBe("this won't be deleted")
      })
  })
})