const express = require('express')
const router = express.Router()

const Product = require('../models/Product')
const Order = require('../models/Order')

const {isAuthenticated} = require('../helpers/auth')

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

module.exports = router