const jwt = require('jsonwebtoken');

const getDecodeToken = (req) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token not provided',
        });
    }
    if (token) {
        try {
            const tokenParts = token.split(' ')
            if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
                throw new Error('Invalid token format');
            }

            return jwt.verify(tokenParts[1], process.env.JWT_SECRET);
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }
    return null;
};

module.exports = { getDecodeToken }