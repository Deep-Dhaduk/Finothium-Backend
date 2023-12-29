const express = require('express')
const Paymentcontroller = require('../controllers/payment.controller');
const auth = require('../middlewares/auth');
const router = express.Router();


router.post(
    "/create-payment",
    auth.verifyToken,
    Paymentcontroller.CreatePayment
);

router.get(
    "/list-payment",
    auth.verifyToken,
    Paymentcontroller.ListPayment
);

router.get(
    "/list-payment/:id",
    auth.verifyToken,
    Paymentcontroller.getPaymentById
);

router.delete(
    "/delete-payment/:id",
    auth.verifyToken,
    Paymentcontroller.deletePayment
);

router.put(
    "/update-payment/:id",
    auth.verifyToken,
    Paymentcontroller.updatePayment
);
module.exports = router;