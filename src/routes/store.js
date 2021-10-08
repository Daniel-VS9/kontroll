const express = require('express');
const {isAuthenticated} = require('../helpers/auth')

const router = express.Router();

const Product = require('../models/Product');

router.get('/list', isAuthenticated, async (req, res) => {
    const products = await Product.find({ userId: req.userId }).lean();
    console.log('--> ' + req.orderId + ' <--') // TODO
    res.render('store/list', {products, id:req.userId, orderId:req.orderId});
});

module.exports = router;