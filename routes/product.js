const express = require('express')
const Category = require('../models/category')
const router = express.Router()
const Product = require('../models/product')

router.get(`/featured/:nbr`, (req, res) => {
  const nbr = req.params.nbr ? req.params.nbr : 1
  console.log('nbr=' + nbr)
  Product.find({ isFeatured: true })
    .limit(+nbr)
    .then((data) => {
      return res.status(200).json(data)
    })
    .catch((err) => {
      return res.status(500).json({ error: err })
    })
})

router.get(`/`, async (req, res) => {
  try {
    const categories = req.query.categories
    let filter = {}
    if (categories) filter = { category: categories.split(',') }
    console.log(filter)
    const products = await Product.find(filter).populate('category')
    return res.status(200).json(products)
  } catch (error) {
    return res.status(500).json({ ...error })
  }
})

router.post(`/`, async (req, res) => {
  const {
    name,
    description,
    details,
    image,
    images,
    brand,
    price,
    category,
    rating,
    numReviews,
    isFeatured,
    inStock,
  } = req.body

  try {
    if (category) {
      const refCategory = await Category.findById(category)

      if (!refCategory)
        return res.status(400).json({ message: 'invalid Category' })
    }

    const product = new Product({
      name,
      description,
      details,
      image,
      images,
      brand,
      price,
      category,
      rating,
      numReviews,
      isFeatured,
      inStock,
    })
    const added = await product.save()
    if (!added) throw new Error('failed to add product')

    return res.status(201).json(added)
  } catch (error) {
    return res.status(500).json({ error: error })
  }
})

router.get(`/:id`, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category')
    if (!product) return res.status(404).json({ message: 'Product not found' })

    return res.status(200).json(product)
  } catch (error) {
    return res.status(500).json({ ...error })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const {
      name,
      description,
      details,
      image,
      images,
      brand,
      price,
      category,
      rating,
      numReviews,
      isFeatured,
      inStock,
    } = req.body
    if (category) {
      const refCategory = await Category.findById(category)

      if (!refCategory)
        return res.status(400).json({ message: 'invalid Category' })
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: name,
        description: description,
        details: details,
        image: image,
        images: images,
        brand: brand,
        price: price,
        category: category,
        rating: rating,
        numReviews: numReviews,
        isFeatured: isFeatured,
        inStock: inStock,
      },
      { new: true }
    )
    if (!updated) {
      return res.status(404).json({ message: 'Product not found' })
    }

    return res.status(200).json(updated)
  } catch (error) {
    return res.status(500).json(error)
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id)
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' })
    }
    return res.status(200).json(deleted)
  } catch (error) {
    return res.status(500).json({ ...error })
  }
})

module.exports = router
