const mongoose = require('mongoose');
const moment = require('moment')
const { Schema } = mongoose;

let today = moment()

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
    stock: {
        type: Number,
    },
    imagePath : {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: today.format("YYYY-MM-DD"),
    },
    userId: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Product', ProductSchema);
