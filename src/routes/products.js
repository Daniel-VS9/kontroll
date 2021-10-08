const express = require('express');
const multer = require('multer')
const path = require('path')
const {v4: uuid} = require('uuid')
const fs = require('fs')

const router = express.Router();
const Product = require('../models/Product');
const {isAuthenticated} = require('../helpers/auth')

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/uploads'),
    filename: (req, file, cb) => {
        console.log(file)
        const ex = path.extname(file.originalname)
        const name = `${uuid()}${ex}`.toLowerCase()
        cb(null, name)
    }
})
const upload = multer({
    storage, 
    dest: path.join(__dirname, '../public/uploads'),
    // limits: { fileSize: 2000000 }, TODO
    fileFilter: (req, file, cb) => {
        const filetypes = /png|jpg|jpeg|gif/
        const mimetype = filetypes.test(file.mimetype)
        const extname = filetypes.test(path.extname(file.originalname))
        if (mimetype && extname) return cb(null, true) 
        cb(null, false)
    }
})


router.get('/', isAuthenticated, async (req, res) => {
    const userId = JSON.stringify(req.user._id).slice(1, -1)

    const products = await Product.find({userId}).sort({ name: 'asc' }).lean();
    res.render('products/allProducts', { products, id:req.userId });
});

router.get('/addProduct', isAuthenticated, (req, res) => {
    res.render('products/addProduct', { id:req.userId });
});

router.post('/addProduct', isAuthenticated, upload.single('image'), async (req, res) => {
    const userId = JSON.stringify(req.user._id).slice(1, -1)
    const { name, price, description } = req.body;
    let imagePath = null;
    if(req.file) imagePath = '/uploads/' + req.file.filename;

    const errors = [];
    if (!name) errors.push({ text: 'Ingresa un nombre' });
    if (!price) errors.push({ text: 'Ingresa un precio' });
    if (!imagePath) errors.push({ text: 'No has seleccionado una imagen'})

    if (errors.length > 0)
        return res.render('products/addProduct', {
            errors,
            name,
            price,
            description,
            id:req.userId,
        });

    const newProduct = new Product({ name, price, description, imagePath, userId});
    await newProduct.save();
    res.redirect('/products');
});

router.get('/edit/:id', isAuthenticated, async (req, res) => {
    const id = req.params.id;
    const product = await Product.findById(id).lean();
    console.log(product.name);
    res.render('products/editProduct', { product, id:req.userId });
});

router.put('/editProduct/:id', isAuthenticated, async (req, res) => {
    const id = req.params.id;
    const { name, price, description } = req.body;

    await Product.findByIdAndUpdate(id, { name, price, description });

    res.redirect('/products');
});

router.delete('/delete/:id', isAuthenticated, async (req, res) => {
    const id = req.params.id

    const product = await Product.findById(id)
    if (product.imagePath) {
        const route = path.join(__dirname, `../public/${product.imagePath}`)
        await fs.promises.unlink(route)
    }
    await Product.findByIdAndRemove(id)
    
    res.redirect('/products')
})

module.exports = router;
