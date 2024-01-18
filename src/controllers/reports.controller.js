const Report = require("../models/reports");
const { getDecodeToken } = require('../middlewares/decoded');

const ListPaymentReport = async (req, res, next) => {
    const token = getDecodeToken(req);
    try {
        const report = await Report.findAllPayment(token.tenantId);
        res.status(200).json({
            success: true,
            message: "Payment Report List Successfully!",
            data: report[0]
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const ListClientReport = async (req, res, next) => {
    const token = getDecodeToken(req);
    try {
        const report = await Report.findAllClient(token.tenantId);
        res.status(200).json({
            success: true,
            message: "Client Report List Successfully!",
            data: report[0]
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const ListCategoryReport = async (req, res, next) => {
    const token = getDecodeToken(req);
    try {
        const report = await Report.findAllCategory(token.tenantId);
        res.status(200).json({
            success: true,
            message: "Category Report List Successfully!",
            data: report[0]
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const ListAccountReport = async (req, res, next) => {
    const token = getDecodeToken(req);
    try {
        const report = await Report.findAllAccount(token.tenantId);
        res.status(200).json({
            success: true,
            message: "Account Report List Successfully!",
            data: report[0]
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const ListGroupReport = async (req, res, next) => {
    const token = getDecodeToken(req);
    try {
        const report = await Report.findAllGroup(token.tenantId);
        res.status(200).json({
            success: true,
            message: "Group Report List Successfully!",
            data: report[0]
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const ListCompanyReport = async (req, res, next) => {
    const token = getDecodeToken(req);
    try {
        const report = await Report.findAllCompany(token.tenantId);
        res.status(200).json({
            success: true,
            message: "Company Report List Successfully!",
            data: report[0]
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

module.exports = {
    ListPaymentReport,
    ListClientReport,
    ListCategoryReport,
    ListAccountReport,
    ListGroupReport,
    ListCompanyReport
}