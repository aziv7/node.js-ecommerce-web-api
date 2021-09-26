const express = require('express')
const { Promise } = require('mongoose')

const router = express.Router()
const Order = require('../models/order')
const orderItem = require('../models/orderItem')

router.get(`/`, async (req, res) => {
  const data = await Order.find().populate('user').sort({ dateOrder: -1 })
  if (!data) return res.status(500).json({ message: 'no Orders Found' })

  return res.status(200).json(data)
})

router.get(`/:id`, async (req, res) => {
  const data = await Order.findById(req.params.id)
    .populate('user')
    .populate({
      path: 'orderItems',
      populate: { path: 'product', populate: 'category' },
    })
  if (!data) return res.status(404).json({ message: 'Order not Found' })

  return res.status(200).json(data)
})

router.put(`/:id`, async (req, res) => {
  const updated = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  )
  if (!updated) return res.status(404).json({ message: 'Order not Found' })

  return res.status(200).json(updated)
})

router.get(`/totalSales`, async (req, res) => {
  try {
    const total = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalPrice: { $sum: '$totalPrice' },
        },
      },
    ])
    if (!total) return res.status(404).json({ message: 'no order sales' })

    return res.status(200).json({ totalSales: total })
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
})

router.get(`/users/:id`, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.id })
      .populate({
        path: 'orderItems',
        populate: { path: 'product', populate: 'category' },
      })
      .sort({ dateOrder: -1 })
    if (!orders) return res.status(404).json({ message: 'no orders found' })

    return res.status(200).json(orders)
  } catch (error) {
    return res.status(500).json(error)
  }
})

router.delete(`/:id`, async (req, res) => {
  try {
    const deleted = await Order.findByIdAndRemove(req.params.id)

    if (!deleted) return res.status(404).json({ message: 'Order not Found' })

    await Promise.all(
      deleted.orderItems.map(async (o) => {
        return await orderItem.findByIdAndRemove(o)
      })
    )

    return res.status(200).json(deleted)
  } catch (error) {
    return res.status(500).json({ message: 'server error' })
  }
})

router.post('/', async (req, res) => {
  let orderIDS
  try {
    const {
      orderItems,
      shippingAddress1,
      shippingAddress2,
      city,
      zip,
      country,
      phone,
      status,
      totalprice,
      user,
      dateOrder,
    } = req.body

    orderItemIds = Promise.all(
      orderItems.map(async (item) => {
        const ordrItem = new orderItem({
          product: item.product,
          quantity: item.quantity,
        })

        const added = await ordrItem.save()
        return added._id
      })
    )

    orderIDS = await orderItemIds
    totalPrices = await Promise.all(
      orderIDS.map(async (productId) => {
        const item = await orderItem
          .findById(productId)
          .populate('product', 'price')

        const price = item.product.price * item.quantity

        return price
      })
    )

    const total = totalPrices.reduce((curr, x) => curr + x, 0)

    const order = new Order({
      orderItems: orderIDS,
      shippingAddress1: shippingAddress1,
      shippingAddress2: shippingAddress2,
      city: city,
      zip: zip,
      country: country,
      phone: phone,
      status: status,
      totalprice: total,
      user: user,
      dateOrder: dateOrder,
    })
    const added = await order.save()
    if (!added) {
      throw new Error('Failed to add Order')
    }

    res.status(201).json(added)
  } catch (error) {
    await Promise.all(
      orderIDS.map(async (o) => {
        await orderItem.findByIdAndRemove(o)
      })
    )
    return res.status(500).json(error)
  }
})

module.exports = router
