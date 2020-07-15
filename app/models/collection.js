const mongoose = require('mongoose')

const collectionSchema = new mongoose.Schema({
  artworks: {
    type: Array,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Collection', collectionSchema)
