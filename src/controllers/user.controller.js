const User = require("../models/user");
const CompanyAccess = require('../models/company_access');
const { upload } = require('../middlewares/upload');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const emailService = require('../service/email.service');
const { createUserSchema } = require('../validation/user.validation');
const { getDecodeToken } = require('../middlewares/decoded');


const uploadImage = (file) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(__dirname, './src/public', fileName);
    fs.writeFileSync(filePath, file.buffer);
    return fileName;
};

const CreateUser = async (req, res) => {
    try {
        const { error } = createUserSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        }

        let { tenantId, username, fullname, email, password, confirmpassword, profile_image, companies, status, createdBy, updatedBy, roleId } = req.body;

        if (!Array.isArray(companies)) {
            return res.status(400).json({
                success: false,
                message: "Companies must be an array of integers (companyId)."
            });
        }

        let user = new User(tenantId, username, fullname, email, password, confirmpassword, profile_image, null, status, createdBy, updatedBy, roleId);

        if (req.file && req.file.buffer) {
            user.profile_image = uploadImage(req.file);
        }

        let newUser = await user.save();

        let companyAccessResults = [];

        for (const companyId of companies) {
            let companyAccess = new CompanyAccess(tenantId, newUser[0].insertId, [companyId], createdBy);
            let companyAccessResult = await companyAccess.save();

            companyAccessResults.push({ companyId, companyAccessResult });
        }

        res.status(200).json({
            success: true,
            message: "User created successfully!",
            data: {
                user: newUser,
                companyAccesses: companyAccessResults
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
        console.log(error);
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [user, _] = await User.findByEmail(email);

        if (!user[0]) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const isValidPassword = await User.comparePassword(password, user[0].password);

        if (!isValidPassword) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const userId = user[0].id;
        const companyResult = await CompanyAccess.findAll(user[0].tenantId);

        const userCompaniesMap = {};
        companyResult[0].forEach(access => {
            const accessUserId = access.user_id;
            if (!userCompaniesMap[accessUserId]) {
                userCompaniesMap[accessUserId] = [];
            }
            userCompaniesMap[accessUserId].push(access.company_id);
        });

        const userWithCompanies = {
            ...user[0],
            companyId: userCompaniesMap[userId] || []
        };

        // Generate JWT token with companyId in the payload
        const tokenPayload = {
            userId: userWithCompanies.id,
            email: userWithCompanies.email,
            tenantId: userWithCompanies.tenantId,
            roleId: userWithCompanies.roleId,
            companyId: userWithCompanies.companyId
        };

        const token = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            userData: userWithCompanies,
            token: token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};



const findOneRec = async (req, res) => {
    try {
        const tokenInfo = getDecodeToken(req);

        if (!tokenInfo.success) {
            return res.status(401).json({
                success: false,
                message: tokenInfo.message,
            });
        }

        const userEmail = tokenInfo.decodedToken.email;

        let checkUser = await User.findByEmail(userEmail);

        if (!checkUser[0]) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({ success: true, data: checkUser[0] });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


const ListUser = async (req, res, next) => {
    const token = getDecodeToken(req)
    try {
        const { q = '', id } = req.query;

        if (id) {
            const user = await User.findById(id);

            if (user[0].length === 0) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            return res.status(200).json({ success: true, message: 'User found', data: user[0][0] });
        }

        const userResult = await User.findAll(token.tenantId);
        let responseData = {
            success: true,
            message: 'User List Successfully!',
            data: userResult[0]
        };

        if (q) {
            const queryLowered = q.toLowerCase();
            const filteredData = userResult[0].filter(
                user =>
                    user.username.toLowerCase().includes(queryLowered) ||
                    user.fullname.toLowerCase().includes(queryLowered) ||
                    (user.status.toLowerCase() === "active" && "active".includes(queryLowered))
            );
            if (filteredData.length > 0) {
                responseData = {
                    ...responseData,
                    data: filteredData,
                    total: filteredData.length
                };
            } else {
                responseData = {
                    ...responseData,
                    message: 'No matching user found',
                    data: [],
                    total: 0
                };
            }
        }

        const companyResult = await CompanyAccess.findAll(token.tenantId);
        let userResponse = responseData.data;
        let companyAccessResponse = companyResult[0]


        const userCompaniesMap = {};

        companyAccessResponse.forEach(access => {
            const userId = access.user_id;

            if (!userCompaniesMap[userId]) {
                userCompaniesMap[userId] = [];
            }

            userCompaniesMap[userId].push(access.company_id);
        });

        userResponse.forEach(user => {
            const userId = user.id;

            if (userCompaniesMap[userId]) {
                user.companyId = userCompaniesMap[userId];
            } else {
                user.companyId = [];
            }
        });

        res.status(200).json({
            data: userResponse
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

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
        let { tenantId, username, fullname, email, password, confirmpassword, profile_image, companyId, status, createdBy, updatedBy, roleId } = req.body;

        if (!companyId) {
            throw new Error("companyId is required for updating user.");
        };

        const companyIdArray = Array.isArray(companyId) ? companyId : [companyId];

        console.log(companyIdArray);

        let user = new User(tenantId, username, fullname, email, password, confirmpassword, profile_image, companyIdArray, status, createdBy, updatedBy, roleId);
        console.log(user);
        let userId = req.params.id;
        let [finduser, _] = await User.findById(userId);
        if (!finduser) {
            throw new Error("User not found!");
        }

        let updateuser = await user.update(userId);

        res.status(200).json({
            success: true,
            message: "User Successfully Updated",
            record: { updateuser },
            returnOriginal: false,
            runValidators: true
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const [user, _] = await User.findByEmail(email);

        if (!user[0]) {
            return res.status(404).json({
                success: false,
                message: 'Email not found'
            });
        }

        const otp = generateOTP();

        await emailService.sendEmail(email, `Your OTP for password reset is: ${otp}`, 'Password Reset OTP');

        // Store the OTP in the database
        await User.saveOTP(email, otp);

        return res.status(200).json({
            success: true,
            message: 'OTP sent to email for password reset'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const verifyOTPAndUpdatePassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const [storedOTP, _] = await User.findOTP(email);

        if (!storedOTP[0] || storedOTP[0].otp !== otp) {
            return res.status(401).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 8);
        await User.updatePassword(email, hashedPassword);

        return res.status(200).json({
            success: true,
            message: 'Password reset successful'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;

        const userId = req.params.id;
        const [user, _] = await User.findById(userId);

        if (!user[0]) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const isValidPassword = await User.comparePassword(oldPassword, user[0].password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid old password'
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'New password and confirm password do not match'
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 8);
        await User.updatePassword(user[0].email, hashedPassword);

        return res.status(200).json({
            success: true,
            message: 'Password reset successful'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
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
    forgotPassword,
    resetPassword,
    verifyOTPAndUpdatePassword
}