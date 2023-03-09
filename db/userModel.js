import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "You must provide a username."],
    unique: [true, "Email already exists."]
  },
  email: {
    type: String,
    required: [true, "You must provide an email."],
    unique: [true, "Email already exists."]
  },
  password: {
    type: String,
    required: [true, "You must provide a password."],
    unique: false
  },
  date: {
    type: Date,
    default: Date.now
  }
})

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
});

const Users = mongoose.model?.Users || mongoose.model("Users", UserSchema)

export default Users