const express = require('express')
const passport = require('passport')
const router = express.Router()

const User = require('../models/User')

router.get('/signin', (req, res) => {
    res.render('users/signin')
})

router.post('/signin', passport.authenticate('local', {
    successRedirect: '/products',
    failureRedirect: '/users/signin'
}))

router.get('/signup', (req, res) => {
    res.render('users/signup')
})

router.post('/signup', async (req, res) => {
    const {name, email, pass, confirmPass} = req.body

    const errors = []

    if (!name || !email || !pass || !confirmPass) errors.push({text: 'Todos los campos son obligatorios'})
    if (pass.length < 8) errors.push({text: 'La clave debe tener minimo 8 caracteres'})
    if (pass !== confirmPass) errors.push({text: 'Las claves no coinciden'})
    if (await User.findOne({email: email})) errors.push({text: 'El email ya se encuentra registrado'})

    if(errors.length > 0) return res.render('users/signup', {errors, name, email})

    const newUser = new User({name, email, pass})
    newUser.pass = await newUser.encryptPass(pass)
    await newUser.save()

    res.redirect('/users/signin')
})

module.exports = router;