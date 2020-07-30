const express = require('express')

const Artwork = require('../models/artwork.js')

const s3Upload = require('../../lib/s3Upload')

// multer stuff
const multer = require('multer')
const upload = multer({ dest: 'public/' })

const passport = require('passport')
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

const randomChars = num => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = '-'
  for (let i = 0; i < num; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

router.post('/post-artwork', requireToken, upload.single('image'), (req, res, next) => {
  s3Upload(req.file, req.body.name + randomChars(16))
    .then((data) => {
      return Artwork.create({
        name: req.body.name,
        description: req.body.description,
        imageUrl: data.Location,
        owner: req.user.id
      })
    })
    .then(artwork => res.status(201).json({ artwork: artwork.toObject() }))
    .catch(next)
})

// Bonus
router.get('/get-artwork', (req, res, next) => {
  Artwork.find()
    .populate('owner')
    .then(artworks => {
      return artworks.map(artwork => artwork.toObject())
    })
    .then(artworks => res.status(200).json({ artworks: artworks }))
    .catch(next)
})

module.exports = router
