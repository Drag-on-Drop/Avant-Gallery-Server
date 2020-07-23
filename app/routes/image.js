// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for images
const Image = require('../models/image')
const User = require('../models/user')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { image: { title: '', text: 'foo' } } -> { image: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /images
router.get('/images', (req, res, next) => {
  Image.find().sort({ _id: -1 })
    .populate('owner')
    .then(images => {
      // `images` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return images.map(image => image.toObject())
    })
    // respond with status 200 and JSON of the images
    .then(images => res.status(200).json({ images: images }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

router.get('/images/recent', (req, res, next) => {
  console.log('req.body', req.body)
  console.log('num requested', req.body.num)
  Image.find().sort({ _id: -1 }).limit(req.body.num || 3)
    .then(artList => {
      res.json({ images: artList })
    })
})

// SHOW
// GET /images/5a7db6c74d55bc51bdf39793
router.get('/images/:id', (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Image.findById(req.params.id)
    .populate('owner')
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "image" JSON
    .then(image => res.status(200).json({ image: image.toObject() }))
    .catch(next)
})

const userAddArt = function (userId, image) {
  User.findById(userId)
    .then(user => {
      // console.log('user.image', user.image)
      user.image.push(image)
      // console.log('user.image after push', user.image)
      return user.save()
    })
}

// POST /images
router.post('/images', requireToken, (req, res, next) => {
  // set owner of new image to be current user
  req.body.image.owner = req.user.id

  Image.create(req.body.image)
    // respond to succesful `create` with status 201 and JSON of new "image"
    .then(image => {
      console.log(image)
      userAddArt(req.user.id, image)
      res.status(201).json({ image: image.toObject() })
    })
    .catch(next)
})

// PATCH /images/5a7db6c74d55bc51bdf39793
router.patch('/images/:id/patch', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.owner

  Image.findById(req.params.id)
    .then(handle404)
    .then(image => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, image)

      image.name = req.body.name
      image.description = req.body.description
      // pass the result of Mongoose's `.update` to the next `.then`
      // return image.updateOne(req.body.image)
      return image.save()
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DELETE /images/5a7db6c74d55bc51bdf39793
router.delete('/images/:id', requireToken, (req, res, next) => {
  Image.findById(req.params.id)
    .then(handle404)
    .then(image => {
      // throw an error if current user doesn't own `image`
      requireOwnership(req, image)
      // delete the image ONLY IF the above didn't throw
      image.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    .catch(next)
})

router.get('/images/user/:id', (req, res, next) => {
  let images = []
  Image.find({ owner: req.params.id })
    .then(artList => {
      console.log('got art')
      console.log('art from this queury', artList)
      console.log('art for this user', images)
      res.json({ images: artList })
    })
    .catch(next)
})

module.exports = router
