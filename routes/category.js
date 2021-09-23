const express = require('express')
const router = express.Router()
const Category = require('../models/category')

router.get(`/`, async (req, res) => {
  const categories = await Category.find()
  if (!categories) res.status(500).json({ error: err })

  res.status(200).json(data)
})
module.exports = router
