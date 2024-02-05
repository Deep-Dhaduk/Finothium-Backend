const Dashboard = require("../models/dashboard");
const { getDecodeToken } = require('../middlewares/decoded');

const ListDashboard = async (req, res, next) => {

    try {
        const tokenInfo = getDecodeToken(req);
        const { tenantId } = tokenInfo.decodedToken;
        const companyId = tokenInfo.decodedToken.company.companyId;

        let dashboardAccountData;
        if (companyId) {
            dashboardAccountData = await Dashboard.getDashboardAccountData(tenantId, companyId);
        }

        const dashboardGroupData = await Dashboard.getDashboardGroupData(tenantId, companyId);

        const dashboardData = await Dashboard.calculateDashboardAmounts(tenantId);

        let responseData = {
            success: true,
            message: 'Dashboard Data Successfully!',
            dashboardData: dashboardData[0],
            dashboardAccountData: dashboardAccountData ? dashboardAccountData[0] : null,
            dashboardGroupData: dashboardGroupData[0]
        };

        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error in ListDashboard:', error);
        next(error);
    }
};

module.exports = {
    ListDashboard
};
