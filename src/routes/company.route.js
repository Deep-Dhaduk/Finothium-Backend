const express = require('express')
const Companycontroller = require('../controllers/company.controller');
const router = express.Router();

router.post(
    "/create-company",
    Companycontroller.CreateCompany
);

router.get(
    "/list-company",
    Companycontroller.ListCompany
);

router.get(
    "/list-company/:id",
    Companycontroller.getCompanyById
);

router.delete(
    "/delete-company/:id",
    Companycontroller.deleteCompany
);

router.put(
    "/update-company/:id",
    Companycontroller.updateCompany
);
module.exports = router;