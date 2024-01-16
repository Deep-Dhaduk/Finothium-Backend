const express = require('express')
const Transactioncontroller = require('../controllers/transaction.controller');
const auth = require('../middlewares/auth');
const router = express.Router();


router.post(
    "/create-transaction",
    auth.verifyToken,
    Transactioncontroller.CreateTransaction
);

router.get(
    "/list-transaction",
    auth.verifyToken,
    Transactioncontroller.ListTransaction
);

router.get(
    "/list-transaction/:id",
    auth.verifyToken,
    Transactioncontroller.getTransactionById
);

router.delete(
    "/delete-transaction/:id",
    auth.verifyToken,
    Transactioncontroller.deleteTransaction
);

router.put(
    "/update-transaction/:id",
    auth.verifyToken,
    Transactioncontroller.updateTransaction
);
module.exports = router;