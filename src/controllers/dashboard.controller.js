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
            data: dashboardData[0][0],
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

        let dashboardAccountData;
        let dashboardGroupData;

        if (companyId) {
            dashboardAccountData = await Dashboard.getDashboardAccountData(tenantId, companyId);
            dashboardGroupData = await Dashboard.getDashboardGroupData(tenantId, companyId);
        };

        const DashboardData = dashboardGroupData[0].map(group => {
            const accounts = dashboardAccountData[0].filter(account => account.account_group_name_id === group.account_group_name_id);
            return {
                account_group_name_id: group.account_group_name_id,
                account_group_name: group.account_group_name,
                TotalPaidAmount: group.TotalPaidAmount,
                TotalReceiveAmount: group.TotalReceiveAmount,
                TotalBalance: group.TotalBalance,
                accounts: accounts.map(account => ({
                    id:account.id,
                    PaidAmount: account.PaidAmount,
                    ReceiveAmount: account.ReceiveAmount,
                    TotalBalance: account.TotalBalance,
                    account_name: account.account_name
                }))
            };
        });

        let responseData = {
            success: true,
            message: 'Dashboard Data Successfully Retrieved!',
            data: DashboardData,
        };

        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error in ListDashboardData:', error);
        next(error);
    }
};


module.exports = {
    ListDashboard,
    ListDashboardGroupData
};
