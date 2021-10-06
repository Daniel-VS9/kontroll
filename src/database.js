require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {})
        console.log('Mongo connection success')
    } catch (error) {
        console.error('MongoDB connection fail')
        console.error(error)
        process.exit(1)
    }
})();

const db = mongoose.connection;

module.exports = db;
