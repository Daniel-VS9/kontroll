const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('index', {id:req.userId})
})

module.exports = router;