const Dashboard = require("../models/dashboard");
const { getDecodeToken } = require('../middlewares/decoded');

const ListDashboard = async (req, res, next) => {

    try {
        const tokenInfo = getDecodeToken(req);
        const { tenantId } = tokenInfo.decodedToken;
        const companyId = tokenInfo.decodedToken.company.companyId;

        const dashboardData = await Dashboard.calculateDashboardAmounts(tenantId, companyId);

        let responseData = {
            success: true,
            message: 'Dashboard Data Successfully!',
            data: dashboardData[0],
        };

        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error in ListDashboard:', error);
        next(error);
    }
};

const ListDashboardAccountData = async (req, res, next) => {

    try {
        const tokenInfo = getDecodeToken(req);
        const { tenantId } = tokenInfo.decodedToken;
        const companyId = tokenInfo.decodedToken.company.companyId;

        let dashboardAccountData;
        if (companyId) {
            dashboardAccountData = await Dashboard.getDashboardAccountData(tenantId, companyId);
        }

        let responseData = {
            success: true,
            message: 'Dashboard Account Data Successfully!',
            data: dashboardAccountData ? dashboardAccountData[0] : null,
        };

        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error in ListDashboard:', error);
        next(error);
    }
};

const ListDashboardGroupData = async (req, res, next) => {

    try {
        const tokenInfo = getDecodeToken(req);
        const { tenantId } = tokenInfo.decodedToken;
        const companyId = tokenInfo.decodedToken.company.companyId;

        const dashboardGroupData = await Dashboard.getDashboardGroupData(tenantId, companyId);

        let responseData = {
            success: true,
            message: 'Dashboard Group Data Successfully!',
            data: dashboardGroupData[0]
        };

        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error in ListDashboard:', error);
        next(error);
    }
};

module.exports = {
    ListDashboard,
    ListDashboardAccountData,
    ListDashboardGroupData
};
