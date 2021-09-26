const mongoose = require('mongoose')

const orderItemSchema = mongoose.Schema(
  {
    quantity: {
      type: Number,
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  { timestamps: { updatedAt: 'updated', createdAt: 'created' } }
)
const orderItem = mongoose.model('OrderItem', orderItemSchema)
module.exports = orderItem
