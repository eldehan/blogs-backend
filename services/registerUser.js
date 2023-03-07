import bcrypt from 'bcrypt'
import User from './../db/userModel.js'

export default async function (body) {
  const newUser = new User({
    username: body.username,
    email: body.email,
    password: body.password
  })

  // Hash password before saving in database
  const hash = await bcrypt.hash(newUser.password, 10)
  newUser.password = hash

  return newUser.save()
}