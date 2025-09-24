const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');

// Local Strategy for signup
passport.use('signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        const { username } = req.body;
        
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        
        if (existingUser) {
            return done(null, false, { 
                message: 'User already exists with this email or username' 
            });
        }

        const user = new User({ email, password, username });
        await user.save();
        
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

// Local Strategy for login
passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'User not found' });
        }

        const validPassword = await user.isValidPassword(password);
        if (!validPassword) {
            return done(null, false, { message: 'Invalid password' });
        }
        
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

// JWT Strategy
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req) => req.cookies?.token
    ]),
    secretOrKey: process.env.JWT_SECRET
}, async (payload, done) => {
    try {
        const user = await User.findById(payload.id);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    } catch (err) {
        return done(err);
    }
}));

module.exports = passport;