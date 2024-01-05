const Report = require("../models/reports");
const { getDecodeToken } = require('../middlewares/decoded');

const CreateReport = async (req, res) => {
    try {
        let { tenantId, company_wise_statement, group_wise_statement, account_wise_statement, payment_type_wise_statement, client_wise_statement, category_wise_statement, createdBy } = req.body;
        let report = new Report(tenantId, company_wise_statement, group_wise_statement, account_wise_statement, payment_type_wise_statement, client_wise_statement, category_wise_statement, createdBy);

        report = await report.save()

        res.status(200).json({
            success: true,
            message: "Report create successfully!",
            record: { report }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        })
        console.log(error);
        next(error)
    }
}

const ListReport = async (req, res, next) => {
    const token = getDecodeToken(req)
    try {
        const report = await Report.findAll(token.tenantId)
        res.status(200).json({
            success: true,
            message: "Report List Successfully!",
            data: report[0]
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

const getReportById = async (req, res, next) => {
    try {
        let Id = req.params.id;
        let [report, _] = await Report.findById(Id);

        res.status(200).json({
            success: true,
            message: "Report Record Successfully!",
            data: { report }
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

const deleteReport = async (req, res, next) => {
    try {
        let Id = req.params.id;
        await Report.delete(Id)
        res.status(200).json({
            success: true,
            message: "Report Delete Successfully!"
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
}

const updateReport = async (req, res, next) => {
    try {
        let { tenantId, company_wise_statement, group_wise_statement, account_wise_statement, payment_type_wise_statement, client_wise_statement, category_wise_statement, updatedBy
        } = req.body;
        let report = new Report(tenantId, company_wise_statement, group_wise_statement, account_wise_statement, payment_type_wise_statement, client_wise_statement, category_wise_statement, updatedBy
        )
        let Id = req.params.id;
        let [findreport, _] = await Report.findById(Id);
        if (!findreport) {
            throw new Error("Report not found!")
        }
        await report.update(Id)
        res.status(200).json({
            success: true,
            message: "Report Successfully Updated",
            record: { report }, returnOriginal: false, runValidators: true
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
}

module.exports = {
    CreateReport,
    ListReport,
    getReportById,
    deleteReport,
    updateReport
}