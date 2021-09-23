const express = require('express')
const env = require('dotenv').config()
const mongoose = require('mongoose')
const productRoutes = require('./routes/product')
const orderRoutes = require('./routes/order')
const userRoutes = require('./routes/user')
const categoryRoutes = require('./routes/category')
const morgan = require('morgan')
const url = process.env.API_PATH
const production = process.env.PROD
const db = process.env.DB
const server = express()

const port = process.env.APP_PORT

production === 'false' && server.use(morgan('tiny'))
server.use(express.json())

server.use(`${url}products`, productRoutes)
server.use(`${url}orders`, orderRoutes)
server.use(`${url}users`, userRoutes)
server.use(`${url}categories`, categoryRoutes)

mongoose
  .connect(db)
  .then(() => {
    console.log('connected to DB')
  })
  .catch((err) => {
    console.log(err)
  })

server.listen(port || 3000, () => {
  console.log('server is running on http://localhost:' + port)
})
