const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const secret = process.env.GEN_SEC
const jwt = require('jsonwebtoken')
const secretJwt = process.env.JWT_SEC

router.get(`/`, async (req, res) => {
  const users = await User.find()

  return res.status(200).json(users)
})

router.get(`/:id`, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).json(error)
  }
})
router.delete(`/:id`, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).json(error)
  }
})
router.post('/register', async (req, res) => {
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
  const salt = bcrypt.genSaltSync(parseInt(secret))
  const hashed = bcrypt.hashSync(password, salt)

  try {
    let user = new User({
      name: name,
      email: email,
      password: hashed,
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
    return res.status(500).json(error)
  }
})

router.post('/login', async (req, res) => {
  try {
    //console.log(secretJwt)
    const user = await User.findOne({ email: req.body.email }).select(
      'password'
    )

    if (!user) return res.status(404).json({ message: 'user not found' })

    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      const logedin = await User.findById(user._id)
      const tokon = jwt.sign(
        { id: logedin._id, crated_at: new Date() },
        secretJwt,
        { expiresIn: '1d' }
      )
      return res.status(200).json({ user: logedin, tokon })
    } else return res.status(200).json({ message: 'invalid cridentials' })
  } catch (error) {
    return res.status(500).json(error)
  }
})

module.exports = router
