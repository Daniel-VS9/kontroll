const express = require('express')
const moment = require('moment')
const router = express.Router()

const Product = require('../models/Product')
const Order = require('../models/Order')

const {isAuthenticated} = require('../helpers/auth')

// All orders for a user
router.get('/all', isAuthenticated, async (req, res) => {
    const orders = await Order.find({userId:req.userId})
    res.json(orders)
})

router.post('/addorder', isAuthenticated, async (req, res) => {
    
    const products = req.body.cart
    let total = 0;

    try {
        products.forEach(product => {
            total += Number(product.price) * Number(product.quantity)
            // product.imagePath = await Product.findById(product.id).imagePath // Need promise all
        })
    
        const newOrder = new Order({products, total, userId:req.userId})
        await newOrder.save()

        res.sendStatus(200)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }

})

router.get('/lastsdays', isAuthenticated, async (req, res) => {
    const today = moment();
    const startDay = today.subtract(7, 'days')

    const orders = await Order.find({userId:req.userId, date:{$gte:startDay}}).exec();
    res.sendStatus(200)
})

router.get('/bydate/:date', isAuthenticated, async (req, res) => {
    const {date} = req.params
    let total = 0

    try {
        const orders = await Order.find({userId:req.userId, date:{$gte:date}}).exec();

        const numberOfOrders = orders.length

        orders.map(order => {
            total += order.total
        })

        res.json({ orders, total, numberOfOrders })

    } catch (error) {
        res.sendStatus(500)
        console.log(error)
    }
})

module.exports = router