const express = require('express')
const TenantController = require('../controllers/tenant.controller');
const router = express.Router();

router.post(
    "/create-tenant",
    TenantController.CreateTenant
);

router.get(
    "/list-tenant",
    TenantController.ListTenant
);

router.get(
    "/list-tenant/:id",
    TenantController.getTenantById
);

router.delete(
    "/delete-tenant/:id",
    TenantController.deleteTenant
);

router.put(
    "/update-tenant/:id",
    TenantController.updateTenant
);
module.exports = router;