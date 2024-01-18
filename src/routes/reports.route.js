const express = require('express')
const Reportcontroller = require('../controllers/reports.controller');
const auth = require('../middlewares/auth');
const router = express.Router();

router.get(
    "/list-payment",
    auth.verifyToken,
    Reportcontroller.ListReport
);

module.exports = router;