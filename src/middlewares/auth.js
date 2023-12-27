const jwt = require('jsonwebtoken');
const express = require("express");
const User = require('../models/user')
const app = express();

const verifyToken = async (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token not provided',
        });
    }

    try {
        const tokenParts = token.split(' ');
        if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
            throw new Error('Invalid token format');
        }

        const decoded = jwt.verify(tokenParts[1], process.env.JWT_SECRET);

        const [user, _] = await User.findByEmail(decoded.email);


        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found',
            });
        }

        req.user = user[0];
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Invalid token',
        });

    }
};

module.exports = { verifyToken };

