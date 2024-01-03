const express = require('express')
const Reportcontroller = require('../controllers/reports.controller');
const auth = require('../middlewares/auth');
const router = express.Router();


router.post(
    "/create-report",
    auth.verifyToken,
    Reportcontroller.CreateReport
);

router.get(
    "/list-report",
    auth.verifyToken,
    Reportcontroller.ListReport
);

router.get(
    "/list-report/:id",
    auth.verifyToken,
    Reportcontroller.getReportById
);

router.delete(
    "/delete-report/:id",
    auth.verifyToken,
    Reportcontroller.deleteReport
);

router.put(
    "/update-report/:id",
    auth.verifyToken,
    Reportcontroller.updateReport
);
module.exports = router;