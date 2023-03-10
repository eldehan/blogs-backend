import { Router } from 'express'

import Blog from '../../db/blogModel.js'
import User from '../../db/userModel.js'

export default function (app) {
  const route = Router()
  app.use('/blogs', route)

  route.get('/', async (req, res, next) => {
    try {
      const blogs = await Blog.find().populate('author')
      res.json({ status: 'success', data: blogs, message: 'Blogs retrieved' })
    } catch (error) {
      next(error)
    }
  })

  route.get('/:id', async (req, res, next) => {
    try {
      // ensure id is valid MongoDB ObjectId format
      if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ status: 'error', data: null, message: 'Invalid blogId' })
      }

      const blog = await Blog.findById(req.params.id).populate('author')
      if (!blog) return res.status(404).json({ status: 'error', data: null, message: 'Blog not found' })
      res.json({ status: 'success', data: blog, message: 'Blog retrieved' })
    } catch (error) {
      next(error)
    }
  })

  route.post('/', async (req, res, next) => {
    try {
      const { title, content, img, authorId } = req.body

      // Find the authoring user based on their id
      const user = await User.findById(authorId)
      if (!user) return res.status(404).json({ status: 'error', data: null, message: 'User not found' })

      // Create a new blog post with the author's _id
      const blogPost = new Blog({
        title,
        img,
        content,
        author: user._id
      })

      // Save the blog post to the database
      let newPost = await blogPost.save()
      res.status(201).json({ status: 'success', data: newPost, message: 'Blog post created' })
    } catch (error) {
      next(error)
    }
  })

  route.put('/:id', async (req, res, next) => {
    try {
      // ensure id is valid MongoDB ObjectId format
      if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ status: 'error', data: null, message: 'Invalid blogId' })
      }

      // find and edit blog if the authorId matches the ID of the user attempting to edit it
      const updatedBlog = await Blog.findOneAndUpdate(
        { _id: req.params.id, author: req.body.author },
        { $set: { ...req.body } },
        { new: true }
      )

      // if no results, return error message
      if (!updatedBlog) return res.status(404).json({ status: 'error', data: null, message: "Unable to edit post. Either the post could not be found or you do not have permission to edit it." })

      res.json({ status: 'success', data: updatedBlog, message: 'Blog post updated' })
    } catch (error) {
      next(error)
    }
  })

  route.delete('/:id', async (req, res, next) => {
    try {
      // ensure id is valid MongoDB ObjectId format
      if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ status: 'error', data: null, message: 'Invalid blogId' })
      }

      // find and delete the blog if the authorId matches the ID of the user attempting to delete it
      const deletedBlog = await Blog.findOneAndDelete({ _id: req.params.id, author: req.body.author })

      // if no results, return error message
      if (!deletedBlog) return res.status(404).json({ status: 'error', data: null, message: "Unable to delete post. You might not have permission to delete this post." })

      res.json({ status: 'success', data: null, message: 'Blog deleted successfully' })
    } catch (error) {
      next(error)
    }
  })
}