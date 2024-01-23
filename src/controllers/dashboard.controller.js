const Dashboard = require("../models/dashboard");
const { getDecodeToken } = require('../middlewares/decoded');

const ListDashboard = async (req, res, next) => {
    const tokenInfo = getDecodeToken(req);

    if (!tokenInfo.success) {
        return res.status(401).json({
            success: false,
            message: tokenInfo.message,
        });
    }
    try {
        const { tenantId } = tokenInfo.decodedToken;

        const dashboardData = await Dashboard.calculateDashboardAmounts(tenantId);
        let responseData = {
            success: true,
            message: 'Dashboard Data Successfully!',
            data: dashboardData[0],
        };
        res.status(200).json(responseData);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

module.exports = {
    ListDashboard
}
