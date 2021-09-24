const mongoose = require('mongoose')

const orderSchema = mongoose.Schema(
  {
    name: String,
    image: String,
    inStock: { type: Number, required: true },
  },
  { timestamps: { updatedAt: 'updated', createdAt: 'created' } }
)
const Order = mongoose.model('Order', orderSchema)
module.exports = Order
