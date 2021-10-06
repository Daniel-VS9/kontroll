const express = require('express');
const router = express.Router();

const Product = require('../models/Product');

router.get('/addProduct', (req, res) => {
    res.render('products/addProduct');
});

router.get('/', async (req, res) => {
    const products = await Product.find().sort({ name: 'asc' }).lean();
    res.render('products/allProducts', { products });
});

router.post('/addProduct', async (req, res) => {
    const { name, price, description } = req.body;

    const errors = [];
    if (!name) errors.push({ text: 'Ingresa un mensaje' });
    if (!price) errors.push({ text: 'Ingresa un precio' });

    if (errors.length > 0)
        return res.render('products/addProduct', {
            errors,
            name,
            price,
            description,
        });

    const newProduct = new Product({ name, price, description });
    await newProduct.save();
    res.redirect('/products');
});

router.get('/edit/:id', async (req, res) => {
    const id = req.params.id;
    const product = await Product.findById(id).lean();
    console.log(product.name);
    res.render('products/editProduct', { product });
});

router.put('/editProduct/:id', async (req, res) => {
    const id = req.params.id;
    const { name, price, description } = req.body;

    await Product.findByIdAndUpdate(id, { name, price, description });

    res.redirect('/products');
});

router.delete('/delete/:id', async (req, res) => {
    const id = req.params.id
    await Product.findByIdAndRemove(id)
    
    res.redirect('/products')
})

module.exports = router;
