const jwt = require('jsonwebtoken');
const express = require("express");
const app = express();


const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(403).json({
                success: false,
                message: 'Token is not provided'
            });
        }
        jwt.verify(
            token.replace("Bearer ", ""),
            process.env.JWT_SECRET,
            (err, decoded) => {
                if (err) {
                    return res.status(401).json({
                        success: false,
                        message: 'Unauthorized access'
                    });
                }
                req.userId = decoded.userId;
                next();
            });
    } catch (error) {
        return next(new Error(error));

    }

};

module.exports = verifyToken