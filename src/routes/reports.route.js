const express = require('express')
const Reportcontroller = require('../controllers/reports.controller');
const auth = require('../middlewares/auth');
const router = express.Router();

router.post(
    "/filter-paymentReport",
    auth.verifyToken,
    Reportcontroller.ListPaymentReport
);

router.post(
    "/filter-clientReport",
    auth.verifyToken,
    Reportcontroller.ListClientReport
);

router.post(
    "/filter-categoryReport",
    auth.verifyToken,
    Reportcontroller.ListCategoryReport
);

router.post(
    "/filter-accountReport",
    auth.verifyToken,
    Reportcontroller.ListAccountReport
);

router.post(
    "/filter-groupReport",
    auth.verifyToken,
    Reportcontroller.ListGroupReport
);

module.exports = router;