// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for artists
const Artist = require('../models/artist')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { artist: { title: '', text: 'foo' } } -> { artist: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /artists
router.get('/artists', (req, res, next) => {
  Artist.find()
    .then(artists => {
      // `artists` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return artists.map(artist => artist.toObject())
    })
    // respond with status 200 and JSON of the artists
    .then(artists => res.status(200).json({ artists: artists }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /artists/5a7db6c74d55bc51bdf39793
router.get('/artists/:id', (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Artist.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "artist" JSON
    .then(artist => res.status(200).json({ artist: artist.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST /artists
router.post('/artists', requireToken, (req, res, next) => {
  // set owner of new artist to be current user
  req.body.artist.owner = req.user.id

  Artist.create(req.body.artist)
    // respond to succesful `create` with status 201 and JSON of new "artist"
    .then(artist => {
      res.status(201).json({ artist: artist.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// UPDATE
// PATCH /artists/5a7db6c74d55bc51bdf39793
router.patch('/artists/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.artist.owner

  Artist.findById(req.params.id)
    .then(handle404)
    .then(artist => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, artist)

      // pass the result of Mongoose's `.update` to the next `.then`
      return artist.updateOne(req.body.artist)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /artists/5a7db6c74d55bc51bdf39793
router.delete('/artists/:id', requireToken, (req, res, next) => {
  Artist.findById(req.params.id)
    .then(handle404)
    .then(artist => {
      // throw an error if current user doesn't own `artist`
      requireOwnership(req, artist)
      // delete the artist ONLY IF the above didn't throw
      artist.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
