const mongoose = require('mongoose')

const artworkSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
    unique: true
  },
  artName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Artwork', artworkSchema)
