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
      if (!user) return res.status(404).json({ message: 'User not found' })

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
      // find and edit blog if the authorId matches the ID of the user attempting to edit it
      const updatedBlog = await Blog.findOneAndUpdate(
        { _id: req.params.id, author: req.authorId },
        { $set: { ...req.body } },
        { new: true }
      )

      // if no results, return error message
      if (!updatedBlog) return res.status(404).json({ message: "Unable to edit post. You might not have permission to edit this post." })

      res.json(updatedBlog)
    } catch (error) {
      next(error)
    }
  })

  route.delete('/:id', async (req, res, next) => {
    try {
      // find and delete the blog if the authorId matches the ID of the user attempting to delete it
      const deletedBlog = await Blog.findOneAndDelete({ _id: req.params.id, author: req.authorId })

      // if no results, return error message
      if (!deletedBlog) return res.status(404).json({ message: "Unable to delete post. You might not have permission to delete this post." })

      res.json({ message: 'Blog deleted successfully' })
    } catch (error) {
      next(error)
    }
  })
}