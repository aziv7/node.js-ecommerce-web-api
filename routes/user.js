const express = require('express')
const router = express.Router()
const User = require('../models/user')
router.get(`/`, async (req, res) => {
  const users = await User.find()

  return res.status(200).json(data)
})

router.post('/', async (req, res) => {
  const {
    name,
    email,
    password,
    street,
    apartment,
    city,
    zip,
    country,
    phone,
    isAdmin,
  } = req.body
  try {
    let user = new User({
      name: name,
      email: email,
      password: password,
      street: street,
      apartment: apartment,
      city: city,
      zip: zip,
      country: country,
      phone: phone,
      isAdmin: isAdmin,
    })
    user = await user.save()
    if (!user) throw new Error('Failed to add User')

    return res.status(201).json(user)
  } catch (error) {
    return res.status(500).json({ ...error })
  }
})

module.exports = router
