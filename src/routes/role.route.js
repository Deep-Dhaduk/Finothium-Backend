const express = require('express')
const Rolecontroller = require('../controllers/role.controller');
const router = express.Router();

router.post(
    "/create-role",
    Rolecontroller.CreateRole
);

router.get(
    "/list-role",
    Rolecontroller.ListRole
);

router.get(
    "/list-role/:id",
    Rolecontroller.getRoleById
);

router.delete(
    "/delete-role/:id",
    Rolecontroller.deleteRole
);

router.put(
    "/update-role/:id",
    Rolecontroller.updateRole
);
module.exports = router;