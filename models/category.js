const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
  name: String,
  image: String,
  inStock: { type: Number, required: true },
})
const Category = mongoose.model('Category', categorySchema)
module.exports = Category
