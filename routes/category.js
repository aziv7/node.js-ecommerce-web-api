const express = require('express')
const router = express.Router()
const Category = require('../models/category')

router.get(`/`, async (req, res) => {
  const categories = await Category.find()
  if (!categories)
    return res.status(500).json({ message: 'no categories found!' })

  return res.status(200).json(categories)
})
router.post('/', async (req, res) => {
  try {
    const category = new Category({
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    })
    const added = await category.save()
    if (!added) throw new Error('Failed to add Category')

    res.status(201).json(added)
  } catch (error) {
    return res.status(500).json(error)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }
    return res.status(200).json(category)
  } catch (error) {
    return res.status(500).json(error)
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { name, icon, color } = req.body
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: name,
        icon: icon,
        color: color,
      },
      { new: true }
    )
    if (!updated) {
      return res.status(404).json({ message: 'Category not found' })
    }

    return res.status(200).json(updated)
  } catch (error) {
    return res.status(500).json(error)
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id)
    if (!deleted) {
      return res.status(404).json({ message: 'Category not found' })
    }
    return res.status(200).json(deleted)
  } catch (error) {
    return res.status(500).json(error)
  }
})
module.exports = router
