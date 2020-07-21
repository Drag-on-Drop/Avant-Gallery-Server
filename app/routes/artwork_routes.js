// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for artworks
const Artwork = require('../models/artwork')
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
// { artwork: { title: '', text: 'foo' } } -> { artwork: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /artworks
router.get('/artworks', (req, res, next) => {
  Artwork.find().sort({ _id: -1 })
    .populate('owner')
    .then(artworks => {
      // `artworks` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return artworks.map(artwork => artwork.toObject())
    })
    // respond with status 200 and JSON of the artworks
    .then(artworks => res.status(200).json({ artworks: artworks }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

router.get('/artworks/recent', (req, res, next) => {
  console.log('req.body', req.body)
  console.log('num requested', req.body.num)
  Artwork.find().sort({ _id: -1 }).limit(req.body.num || 3)
    .then(artList => {
      res.json({ artworks: artList })
    })
})

// SHOW
// GET /artworks/5a7db6c74d55bc51bdf39793
router.get('/artworks/:id', (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Artwork.findById(req.params.id)
    .populate('owner')
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "artwork" JSON
    .then(artwork => res.status(200).json({ artwork: artwork.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

const userAddArt = function (userId, artwork) {
  User.findById(userId)
    .then(user => {
      // console.log('user.artwork', user.artwork)
      user.artwork.push(artwork)
      // console.log('user.artwork after push', user.artwork)
      return user.save()
    })
}

// CREATE
// POST /artworks
router.post('/artworks', requireToken, (req, res, next) => {
  // set owner of new artwork to be current user
  req.body.artwork.owner = req.user.id

  Artwork.create(req.body.artwork)
    // respond to succesful `create` with status 201 and JSON of new "artwork"
    .then(artwork => {
      console.log(artwork)
      userAddArt(req.user.id, artwork)
      res.status(201).json({ artwork: artwork.toObject() })
    })
    .catch(next)
})

// UPDATE
// PATCH /artworks/5a7db6c74d55bc51bdf39793
router.patch('/artworks/:id/patch', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.owner

  Artwork.findById(req.params.id)
    .then(handle404)
    .then(artwork => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, artwork)

      artwork.name = req.body.name
      artwork.description = req.body.description
      // pass the result of Mongoose's `.update` to the next `.then`
      // return artwork.updateOne(req.body.artwork)
      return artwork.save()
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /artworks/5a7db6c74d55bc51bdf39793
router.delete('/artworks/:id', requireToken, (req, res, next) => {
  Artwork.findById(req.params.id)
    .then(handle404)
    .then(artwork => {
      // throw an error if current user doesn't own `artwork`
      requireOwnership(req, artwork)
      // delete the artwork ONLY IF the above didn't throw
      artwork.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

router.get('/artworks/user/:id', (req, res, next) => {
  let artworks = []
  Artwork.find({ owner: req.params.id })
    .then(artList => {
      // console.log('getting art:', artList)
      console.log('got art')
      // artList.foreach(art => artworks.push(art))
      console.log('art from this queury', artList)
      console.log('art for this user', artworks)
      res.json({ artworks: artList })
    })
    .catch(next)
})

module.exports = router
