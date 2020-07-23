const express = require('express')

const Image = require('../models/image.js')

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

router.post('/post-image', requireToken, upload.single('image'), (req, res, next) => {
  console.log('req file', req.file)
  console.log('req body', req.body)
  console.log('req body name', req.body.name)
  s3Upload(req.file, req.body.name + randomChars(16))
    .then((data) => {
      return Image.create({
        name: req.body.name,
        description: req.body.description,
        imageUrl: data.Location,
        owner: req.user.id
      })
    })
    .then(image => res.status(201).json({ image: image.toObject() }))
    .catch(console.error)
})

// router.post('/images', requireToken, (req, res, next) => {
//   // set owner of new image to be current user
//   req.body.image.owner = req.user.id
//
//   Image.create(req.body.image)
//     // respond to succesful `create` with status 201 and JSON of new "image"
//     .then(image => {
//       console.log(image)
//       userAddArt(req.user.id, image)
//       res.status(201).json({ image: image.toObject() })
//     })
//     .catch(next)
// })

router.get('/get-image', (req, res, next) => {
  Image.find()
    .populate('owner')
    .then(images => {
      return images.map(image => image.toObject())
    })
    .then(images => res.status(200).json({ images: images }))
    .catch(next)
})

module.exports = router
