const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('../models/User')

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'pass',
}, async (email, pass, done) => {
    const user = await User.findOne({email})
    if (!user) return done(null, false, {message: 'Usuario no encontrado'})

    const match = await user.matchPass(pass)
    if(match) return done(null, user)
    return done(null, false, {message: 'Clave incorrecta'})
}))


passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id, (error, user) => {
        done(error, user)
    })
})