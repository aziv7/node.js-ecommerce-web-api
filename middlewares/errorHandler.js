const errorHandler = (error, req, res, next) => {
  if (error.name === 'UnauthorizedError')
    return res.status(error.status).json({ message: 'unauthorised token' })
  else if (error.name === 'ValidationError')
    return res.status(error.status).json(error)
  else if (error) return res.status(500).json({ message: 'server error' })
  next()
}

module.exports = errorHandler
