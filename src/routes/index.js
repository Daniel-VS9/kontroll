const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('index', {id:req.userId})
})

// router.get('/about', (req, res) => {
//     res.render('about')
// })

module.exports = router;