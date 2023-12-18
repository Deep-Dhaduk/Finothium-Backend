const User = require("../models/user");
const jwt = require('jsonwebtoken');
const db = require('../db/dbconnection')


const CreateUser = async (req, res) => {
    try {

        let { tenantId, username, fullname, email, password, confirmpassword, profile_image, company, status, resetpassword, roleId } = req.body;
        let user = new User(tenantId, username, fullname, email, password, confirmpassword, profile_image, company, status, resetpassword, roleId);

        user = await user.save()

        res.status(200).json({
            success: true,
            message: "user create successfully!",
            record: user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
        console.log(error);
        next(error)
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const [user, _] = await User.findByEmail(email);

        if (user[0]) {
            const isValidPassword = await User.comparePassword(password, user[0].password);

            if (!isValidPassword) {
                res.status(401).json({
                    message: 'Invalid password'
                })
            }

            // Create JWT token
            const token = jwt.sign(
                { userId: user[0].id, email: user[0].email },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN } // Token expiry time
            );

            res.status(200).json({
                success: true,
                message: 'Login successful',
                token: token
            });
        }
        res.status(401).json({
            message: 'Invalid email or password'
        })

    } catch (error) {
        console.log(error);
        next(error);
    }
};

const findOneRec = async (req, res) => {
    try {
        let checkUser = await User.findOne()
        return res.status(200).json({ success: true, data: checkUser });

    } catch (error) {
        res.status(501).json({ success: false, error: error.message })
    }
}

const ListUser = async (req, res, next) => {
    try {
        const user = await User.findAll()
        res.status(200).json({
            success: true,
            message: "User List Successfully!",
            data: { user }
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
}

const getUserById = async (req, res, next) => {
    try {
        let userId = req.params.id;
        let [user, _] = await User.findById(userId);

        res.status(200).json({
            success: true,
            message: "User Record Successfully!",
            data: { user }
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

const deleteUser = async (req, res, next) => {
    try {
        let userId = req.params.id;
        await User.delete(userId)
        res.status(200).json({
            success: true,
            message: "User Delete Successfully!"
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
}

const updateUser = async (req, res, next) => {
    try {
        let { tenantId, username, fullname, email, profile_image, company, status, resetpassword, roleId } = req.body;
        let user = new User(tenantId, username, fullname, email, profile_image, company, status, resetpassword, roleId)
        let userId = req.params.id;
        let [finduser, _] = await User.findById(userId);
        if (!finduser) {
            throw new Error("User not found!")
        }
        let updateuser = await user.update(userId)
        res.status(200).json({
            success: true,

            message: "User Successfully Updated",
            record: { updateuser }, returnOriginal: false, runValidators: true
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
}

module.exports = {
    CreateUser,
    ListUser,
    getUserById,
    deleteUser,
    updateUser,
    loginUser,
    findOneRec
}