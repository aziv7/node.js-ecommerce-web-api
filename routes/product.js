const express = require('express')
const router = express.Router()
const Product = require('../models/product')

router.get(`/`, (req, res) => {
  Product.find()
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((err) => {
      res.status(500).json({ error: err })
    })
})
router.post(`/`, async (req, res) => {
  const data = req.body
  data.name = data.name || 'Product'
  data.image = data.image || null
  data.inStock = data.inStock || 0
  Product.create(data)
    .then((created) => {
      res.status(201).json(created)
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      })
    })
})

module.exports = router
