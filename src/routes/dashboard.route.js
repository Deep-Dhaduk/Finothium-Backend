const express = require('express')
const Dashboardcontroller = require('../controllers/dashboard.controller');
const auth = require('../middlewares/auth');
const router = express.Router();

router.get(
    "/list-dashboard",
    auth.verifyToken,
    Dashboardcontroller.ListDashboard
);

module.exports = router;