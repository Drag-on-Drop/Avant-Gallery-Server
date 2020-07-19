const express = require('express')
const passport = require('passport')
const errors = require('../../lib/custom_errors')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404

const BadParamsError = errors.BadParamsError
const BadCredentialsError = errors.BadCredentialsError

const User = require('../models/user')


const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /images
router.get('/artists', (req, res, next) => {
  User.find()
    .then(users => {
      const userList = users.map(user => user.toObject())
      console.log(userList)
      res.json({ users: userList })
    })
    .catch(next)
})

// UPDATE user
// PATCH /update-user
router.patch('/update-user', requireToken, (req, res, next) => {
  let user
  // `req.user` will be determined by decoding the token payload
  User.findById(req.user.id)
  // console.log("user is", user)
    // save user outside the promise chain
    .then(record => {
      user = record
      console.log('record is', record)
    })
    // check that the params are
    .then(() => {
      const credentials = {
        name: req.body.credentials.name || 'Anonymous',
        location: req.body.credentials.location || 'No Location Given',
        biography: req.body.credentials.biography || 'No Biography Found'
      }
      console.log('user credentials are:', credentials)
      // return necessary params to update the user
      return credentials
    })
    .then((credentials) => {
      console.log('user credentials one level down are:', credentials)
      user.name = credentials.name
      user.location = credentials.location
      user.biography = credentials.biography
      return user.save()
    })
    // respond with no content and status 200
    .then(() => res.sendStatus(204))
    // pass any errors along to the error handler
    .catch(next)
})

// SHOW
// GET /images/5a7db6c74d55bc51bdf39793
router.get('/artists/:id', (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  User.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "artwork" JSON
    .then(user => {
      console.log(user)
      return res.status(200).json({ user: user.toObject() })
    })
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
