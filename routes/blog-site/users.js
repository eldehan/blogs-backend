import { Router } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import config from '../../config/index.js'

import registerUser from '../../services/registerUser.js'
import validateRegisterInput from '../../services/validation/register.js'
import validateLoginInput from '../../services/validation/login.js'
import User from '../../db/userModel.js'

export default function (app) {
  const route = Router()
  app.use('/users', route)

  route.get('/:username', async (req, res, next) => {
    try {
      const user = await User.findOne({
        username: req.params.username
      }).select({ password: 0, email: 0 })

      if (!user) return res.status(404).json({ message: "User not found" })

      res.json(user)
    } catch (error) {
      next(error)
    }
  })

  route.post('/register', async (req, res, next) => {
    try {
      // validate registration info
      const { errors, isValid } = validateRegisterInput(req.body)
      if (!isValid) return res.status(400).json(errors)

      // check db to see if user already exists, otherwise, create user
      const user = await User.findOne({
        $or: [
          { email: req.body.email },
          { username: req.body.username }
        ]
      })

      if (user) {
        return user.username === req.body.username
          ? res.status(400).json({ message: "Username already exists" })
          : res.status(400).json({ message: "Email already exists" })
      }

      // register user
      const newUser = await registerUser(req.body)
      res.json(newUser)
    } catch (error) {
      next(error)
    }
  })

  route.post('/login', async (req, res, next) => {
    try {
      // validate login info
      const { errors, isValid } = validateLoginInput(req.body)
      if (!isValid) return res.status(400).json(errors)

      const email = req.body.email
      const password = req.body.password

      // find user by email
      const user = await User.findOne({ email })
      if (!user) return res.status(404).json({ message: "Email not found" })

      // check if passwords match
      const match = await bcrypt.compare(password, user.password)
      if (!match) return res.status(400).json({ message: "Password incorrect" })

      // user matched, create jwt payload
      const payload = {
        id: user._id.valueOf(),
        username: user.username,
        email: user.email
      }

      // sign token
      jwt.sign(
        payload,
        config.secretOrKey,
        {
          expiresIn: 2629744 // ~30 days in seconds
        },
        (err, token) => {
          res.json({
            success: true,
            token: `Bearer ${token}`
          })
        }
      )
    } catch (error) {
      next(error)
    }
  })
}