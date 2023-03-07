import { Router } from 'express'

import Blog from '../../db/blogModel.js'
import User from '../../db/userModel.js'

export default function (app) {
  const route = Router()
  app.use('/blogs', route)

  route.get('/', async (req, res, next) => {
    try {
      const blogs = await Blog.find().populate('author')
      res.json(blogs)
    } catch (error) {
      next(error)
    }
  })

  route.get('/:id', async (req, res, next) => {
    try {
      const blog = await Blog.findById(req.params.id).populate('author')
      if (!blog) return res.status(404).json({ message: 'Blog not found' })
      res.json(blog)
    } catch (error) {
      next(error)
    }
  })

  route.post('/', async (req, res, next) => {
    try {
      const { title, content, img, authorId } = req.body

      // Find the authoring user based on their id
      const user = await User.findById(authorId)
      if (!user) return res.status(404).json({ error: 'User not found' })

      // Create a new blog post with the author's _id
      const blogPost = new Blog({
        title,
        img,
        content,
        author: user._id
      });

      // Save the blog post to the database
      let newPost = await blogPost.save()
      res.status(201).json({ message: 'Blog post created', data: newPost })
    } catch (error) {
      next(error)
    }
  })

  route.put('/:id', async (req, res, next) => {
    try {
      const updatedBlog = await Blog.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { ...req.body } },
        { new: true }
      )
      res.json(updatedBlog)
    } catch (error) {
      next(error)
    }
  })

  route.delete('/:id', async (req, res, next) => {
    try {
      const deletedBlog = await Blog.findByIdAndDelete(req.params.id)
      if (!deletedBlog) return res.status(404).json({ message: 'Blog not found' })
      return res.json({ message: 'Blog deleted successfully' })
    } catch (error) {
      next(error)
    }
  })
}