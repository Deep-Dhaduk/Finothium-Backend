const express = require('express')
const Reportcontroller = require('../controllers/reports.controller');
const auth = require('../middlewares/auth');
const router = express.Router();

router.post(
    "/filter-paymentReport",
    auth.verifyToken,
    Reportcontroller.ListPaymentReport
);
router.get(
    "/list-payment",
    auth.verifyToken,
    Reportcontroller.ListPaymentReport
);

router.get(
    "/list-client",
    auth.verifyToken,
    Reportcontroller.ListClientReport
);

router.get(
    "/list-category",
    auth.verifyToken,
    Reportcontroller.ListCategoryReport
);

router.get(
    "/list-account",
    auth.verifyToken,
    Reportcontroller.ListAccountReport
);

router.get(
    "/list-group",
    auth.verifyToken,
    Reportcontroller.ListGroupReport
);

router.get(
    "/list-company",
    auth.verifyToken,
    Reportcontroller.ListCompanyReport
);

module.exports = router;