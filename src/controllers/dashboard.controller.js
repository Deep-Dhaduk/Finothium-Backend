const Dashboard = require("../models/dashboard");
const { getDecodeToken } = require('../middlewares/decoded');

const ListDashboard = async (req, res, next) => {
    const token = getDecodeToken(req)
    try {
        const dashboard = await Dashboard.findAll(token.tenantId)
        res.status(200).json({
            success: true,
            message: "Dashboard List Successfully!",
            data: dashboard[0]
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

module.exports = {
    ListDashboard
}