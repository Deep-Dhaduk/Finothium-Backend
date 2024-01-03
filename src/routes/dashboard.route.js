const express = require('express')
const Dashboardcontroller = require('../controllers/dashboard.controller');
const auth = require('../middlewares/auth');
const router = express.Router();


router.post(
    "/create-dashboard",
    auth.verifyToken,
    Dashboardcontroller.CreateDashboard
);

router.get(
    "/list-dashboard",
    auth.verifyToken,
    Dashboardcontroller.ListDashboard
);

router.get(
    "/list-dashboard/:id",
    auth.verifyToken,
    Dashboardcontroller.getDashboardById
);

router.delete(
    "/delete-dashboard/:id",
    auth.verifyToken,
    Dashboardcontroller.deleteDashboard
);

router.put(
    "/update-dashboard/:id",
    auth.verifyToken,
    Dashboardcontroller.updateDashboard
);
module.exports = router;