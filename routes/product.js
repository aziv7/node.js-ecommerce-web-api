const express = require('express')
const Category = require('../models/category')
const router = express.Router()
const Product = require('../models/product')
const multer = require('multer')
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

const ALLOWED_FILES = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const ext = ALLOWED_FILES[file.mimetype]

    let uploadError = new Error('invalid image File')

    if (ext) uploadError = null

    cb(uploadError, './public/uploads')
  },
  filename: function (req, file, cb) {
    const ext = ALLOWED_FILES[file.mimetype]
    const name = file.originalname.split('.')[0].split(' ').join('_')
    cb(null, `${name}_${Date.now()}.${ext}`)
  },
})

const uploadOptions = multer({ storage: storage })

router.post(`/`, uploadOptions.single('image'), async (req, res) => {
  const {
    name,
    description,
    details,

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
    if (!req.file) return res.status(400).json({ message: 'image is required' })

    const filePath = `${req.protocol}://${req.get('host')}/public/uploads/${
      req.file.filename
    }`
    const product = new Product({
      name,
      description,
      details,
      image: filePath,
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

router.put(
  '/gallery/:id',
  uploadOptions.array('images', 15),
  async (req, res) => {
    const files = req.files

    const imgs = []

    if (files) {
      files.map((f) => {
        imgs.push(
          `${req.protocol}://${req.get('host')}/public/uploads/${f.filename}`
        )
      })
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { images: imgs },
      { new: true }
    )
    if (!product) return res.status(404).json({ message: 'Product not found' })

    return res.status(200).json(product)
  }
)

router.put('/:id', uploadOptions.single('image'), async (req, res) => {
  try {
    const {
      name,
      description,
      details,
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
    const prod = await Product.findById(req.params.id)

    if (!prod) return res.status(404).json({ message: 'Product not found' })

    const filePath = req.file
      ? `${req.protocol}://${req.get('host')}/public/uploads/${
          req.file.filename
        }`
      : prod.image
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: name,
        description: description,
        details: details,
        image: filePath,
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
