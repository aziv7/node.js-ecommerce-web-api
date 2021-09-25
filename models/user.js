const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { unique: true, type: String, required: true },
    password: { select: false, type: String, required: true },
    street: { type: String, default: '' },
    apartment: { type: String, default: '' },
    city: { type: String, default: '' },
    zip: { type: String, default: '' },
    country: { type: String, default: '' },
    phone: { type: Number, required: true },
    isAdmin: { type: Boolean, default: false, required: false },
  },
  { timestamps: { updatedAt: 'updated', createdAt: 'created' } }
)
const User = mongoose.model('User', userSchema)
module.exports = User
