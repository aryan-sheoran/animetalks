const passport = require('passport');

const verifyToken = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: 'Authentication error' });
        }
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = user;
        next();
    })(req, res, next);
};

const optionalAuth = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            // You might want to log this error but not send a 500,
            // as it's an optional authentication.
            return next(); 
        }
        if (user) {
            req.user = user;
        }
        next();
    })(req, res, next);
};

module.exports = { verifyToken, optionalAuth };