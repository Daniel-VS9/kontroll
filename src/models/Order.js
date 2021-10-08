const mongoose = require('mongoose');
const { Schema } = mongoose;

const Product = require('./Product');

const OrderSchema = new Schema({
    products: {
        type: Array,
        default: []
    },
    date: {
        type: Date,
        default: Date.now,
    },
    total: {
        type: Number,
        default: 0,
    },
    userId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Order', OrderSchema);
