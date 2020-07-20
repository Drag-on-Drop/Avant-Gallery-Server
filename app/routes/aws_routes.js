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
  console.log('req file', req.file)
  console.log('req body', req.body)
  console.log('req body name', req.body.name)
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
    .catch(console.error)
})

// router.post('/artworks', requireToken, (req, res, next) => {
//   // set owner of new artwork to be current user
//   req.body.artwork.owner = req.user.id
//
//   Artwork.create(req.body.artwork)
//     // respond to succesful `create` with status 201 and JSON of new "artwork"
//     .then(artwork => {
//       console.log(artwork)
//       userAddArt(req.user.id, artwork)
//       res.status(201).json({ artwork: artwork.toObject() })
//     })
//     .catch(next)
// })

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
