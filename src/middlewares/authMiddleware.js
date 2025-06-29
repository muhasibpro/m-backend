const jwt = require('jsonwebtoken');
const User = require('../model/userModel');

const authMiddleware = {
    protect: async (req, res, next) => {
        let token = req.headers.authorization && req.headers.authorization.startsWith('Bearer')
            ? req.headers.authorization.split(' ')[1]
            : null;

        if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = await User.findById(decoded.userId).select('-password');
            next();
        } catch (err) {
            res.status(401).json({ message: 'Token is not valid' });
        }
    },

    isAdmin: (req, res, next) => {
        if (req.user && req.user.role === 99) {
            next();
        } else {
            res.status(403).json({ message: 'Not authorized as admin' });
        }
    }
};

module.exports = authMiddleware;