const mongoose = require('mongoose')

const artworkSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Artwork', artworkSchema)
