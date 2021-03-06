const express = require('express')
const path = require('path')
const exhbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')

const app = express()
require('dotenv').config();
require('./database')
require('./config/passport')

const PORT = process.env.PORT || 3000
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exhbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
}))
app.set('view engine', '.hbs')

// Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))
app.use(session({
    secret: 'supersecretapp',
    resave: false,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
    (req.user && req.user._id) ? req.userId = JSON.stringify(req.user._id).slice(1, -1) : req.userId = null
    // console.log(req.userId)
    next()
})


//Routes
app.use('/', require('./routes/index'))
app.use('/products', require('./routes/products'))
app.use('/users', require('./routes/users'))
app.use('/store', require('./routes/store'))
app.use('/orders', require('./routes/orders'))

// Static files
app.use(express.static(path.join(__dirname, 'public')))

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})