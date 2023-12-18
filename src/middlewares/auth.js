const jwt = require('jsonwebtoken');
const express = require("express");
const { User } = require('../models/user')
const app = express();

// // const verifyToken = (req, res, next) => {
// //     const token = req.headers.authorization;
// //     console.log(token);

// //     if (!token) {
// //         return res.status(401).json({
// //             message: 'Unauthorized: No token provided'
// //         });
// //     }

// //     jwt.verify(
// //         token.replace("Bearer ", ""),
// //         process.env.JWT_SECRET,
// //         (err, decoded) => {
// //             if (err) {
// //                 return res.status(401).json({
// //                     message: 'Unauthorized: Invalid token'
// //                 });
// //             }
// //             req.userId = decoded.userId; // You can use req.userId in your routes to access the user ID
// //             next();
// //         });
// // };

// // module.exports = verifyToken

const verifyToken = (req, res, next) => {
    try {
        const token = req.header('token')
        // console.log('Token received in backend:', token);
        if (!token) {
            return res.status(401).json({ success: false, error: 'Please enter valid token' })
        }
        const data = jwt.verify(token, process.env.JWT_SECRET)
        req.user = data.user;
        next();

    } catch (error) {
        // console.error('Token verification error:', error);
        res.status(401).json({ success: false, error: 'Please enter valid token' })
    }
}

module.exports = { verifyToken }