const expressJwt = require('express-jwt')
const User = require('../models/user')
const secret = process.env.JWT_SEC
const authJWT = () => {
  return expressJwt({
    secret,
    algorithms: ['HS256'],
    isRevoked: async (req, payload, done) => {
      const user = await User.findById(payload.id)

      if (user.isAdmin === false) done(null, true)

      done()
    },
  }).unless({
    path: [
      { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
      '/api/v1/users/login',
      '/api/v1/users/register',
    ],
  })
}

module.exports = authJWT
