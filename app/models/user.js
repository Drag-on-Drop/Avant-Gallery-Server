const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  biography: {
    type: String,
    required: true
  },
  artwork: { // delete eventually
    type: Array,
    required: true
  },
  token: String
}, {
  timestamps: true,
  toObject: {
    transform: (_doc, user) => {
      delete user.hashedPassword
      return user
    }
  }
})

module.exports = mongoose.model('User', userSchema)
