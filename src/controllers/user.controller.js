const User = require("../models/user");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const emailService = require('../service/email.service');

const CreateUser = async (req, res) => {
    try {

        let { tenantId, username, fullname, email, password, confirmpassword, companyId, status, resetpassword, roleId } = req.body;

        let user = new User(tenantId, username, fullname, email, password, confirmpassword, '', companyId, status, resetpassword, roleId);

        if (req.file && req.file.buffer) {
            const imageBase64 = req.file.buffer.toString('base64');
            user.profile_image = imageBase64;
            // console.log(imageBase64);
        };

        let newUser = await user.save()

        res.status(200).json({
            success: true,
            message: "user create successfully!",
            record: newUser
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

const loginUser = async (req, res) => {
    try {
        const { email, password, roleId } = req.body;

        if (!email || !password || !roleId) {
            return res.status(400).json({
                success: false,
                message: 'Email, password, and roleId are required in the request body',
            });
        }
        const [user, _] = await User.findByEmail(email);

        if (user[0]) {
            const isValidPassword = await User.comparePassword(password, user[0].password);

            if (!isValidPassword) {
                res.status(401).json({
                    message: 'Invalid email or password'
                })
            }

            // Create JWT token
            const token = jwt.sign(
                { userId: user[0].id, email: user[0].email, roleId: user[0].roleId, companyId: user[0].companyId },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            res.status(200).json({
                success: true,
                message: 'Login successful',
                userData: user,
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
        const userEmail = req.user.email;

        let checkUser = await User.findByEmail(userEmail);

        if (!checkUser[0]) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.status(200).json({ success: true, data: checkUser[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}


const ListUser = async (req, res, next) => {
    try {
        const user = await User.findAll()
        res.status(200).json({
            success: true,
            message: "User List Successfully!",
            data: user[0]
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
            data: user[0]
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
        let { tenantId, username, fullname, email, profile_image, companyId, status, resetpassword, roleId } = req.body;
        let user = new User(tenantId, username, fullname, email, profile_image, companyId, status, resetpassword, roleId)
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
};


const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

const sendResetPasswordMail = async (email, otp) => {
    try {
        const sendEmail = await emailService.sendMail(
            email,
            `Your OTP for password reset is: ${otp}`
        );
        if (!sendEmail) {
            throw new Error("Something went wrong, please try again or later.");
        }
    } catch (error) {
        throw error;
    }
};

const sendMail = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findByEmail(email);

        if (!user[0]) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const otp = generateOTP();
        console.log(otp);

        const updateOTP = await User.updateOTP(email, otp);

        if (!updateOTP) {
            throw new Error("Failed to update OTP in the user record");
        }

        // Send the OTP via email
        await sendResetPasswordMail(email, otp);

        res.status(200).json({
            success: true,
            message: "Email send successfully!",
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const resetPassword = async (req, res) => {
    const { email, otp, resetpassword } = req.body;
    try {
        const user = await User.findByEmail(email);

        if (!user[0]) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        // Check if the provided OTP matches the stored OTP in the user record
        if (user[0].resetpassword !== req.body.otp) {
            console.log(req.body.otp);
            return res.status(401).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        // Reset the password and clear the OTP
        const hashedPassword = await bcrypt.hash(resetpassword, 8);
        await User.resetPassword(email, hashedPassword);

        res.status(200).json({
            success: true,
            message: 'Password reset successfully',
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    CreateUser,
    ListUser,
    getUserById,
    deleteUser,
    updateUser,
    loginUser,
    findOneRec,
    sendMail,
    resetPassword
}