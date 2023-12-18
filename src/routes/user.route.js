const express = require('express')
const UserController = require('../controllers/user.controller');
const router = express.Router();
const verifyToken = require('../middlewares/auth')


router.post(
    "/create-user",
    UserController.CreateUser
);

router.post(
    "/login",
    UserController.loginUser
);

router.get(
    "/verify",
    UserController.loginUser
);

router.get(
    "/list-user",
    verifyToken(),
    UserController.verifyToken
);

router.get(
    "/list-user/:id",
    UserController.getUserById
);

router.delete(
    "/delete-user/:id",
    UserController.deleteUser
);

router.put(
    "/update-user/:id",
    UserController.updateUser
);

module.exports = router;