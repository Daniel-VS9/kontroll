const express = require('express')
const router = express.Router()

const Product = require('../models/Product')
const Order = require('../models/Order')

router.post('/neworder', (req, res) => { // TODO authenticate
    const order = new Order({ userId:req.userId })
    req.orderId = JSON.stringify(order._id).substring(1,-1)
    console.log(order) // TODO delete this line
    // res.send(`${order._id}`)
    res.redirect('/store/list')
})

router.post('/addtoorder/:id', async (req, res) => { // TODO authenticate
    const productId = req.params.id
    const { quantity } = req.body

    if(typeof quantity !== Number || quantity < 1) return res.redirect('/store/list')

    const product = await Product.findById(productId)
    const order = Order.find({ userId,  })

})

module.exports = router