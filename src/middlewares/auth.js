const jwt = require('jsonwebtoken');
const express = require("express");
const User = require('../models/user');
const { getDecodeToken } = require('../middlewares/decoded')
const app = express();

const verifyToken = async (req, res, next) => {
    try {
        const decoded = getDecodeToken(req);
        const [user, _] = await User.findByEmail(decoded.email);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found',
            });
        };
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

