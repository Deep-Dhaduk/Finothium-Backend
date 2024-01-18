const Report = require("../models/reports");
const { getDecodeToken } = require('../middlewares/decoded');

const ListReport = async (req, res, next) => {
    const token = getDecodeToken(req);
    try {
        const report = await Report.findAllPayment(token.tenantId);
        res.status(200).json({
            success: true,
            message: "Report List Successfully!",
            data: report
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

module.exports = {
    ListReport
}