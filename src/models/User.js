const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const {Schema} = mongoose

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    pass: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

UserSchema.methods.encryptPass = async (pass) => {
    const salt = await bcrypt.genSalt(10);
    const hashed = bcrypt.hash(pass, salt)
    return hashed;
}

UserSchema.methods.matchPass = async function(pass) {
    return await bcrypt.compare(pass, this.pass)
}

module.exports = mongoose.model('User', UserSchema)