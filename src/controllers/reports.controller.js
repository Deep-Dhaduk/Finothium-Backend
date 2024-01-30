const Report = require("../models/reports");
const { getDecodeToken } = require('../middlewares/decoded');

const ListPaymentReport = async (req, res, next) => {
    const tokenInfo = getDecodeToken(req);

    if (!tokenInfo.success) {
        return res.status(401).json({
            success: false,
            message: tokenInfo.message,
        });
    }

    try {
        const { q = '' } = req.query;
        const { tenantId, companyId } = tokenInfo.decodedToken;
        const { startDate, endDate, paymentTypeName } = req.body;
        if (companyId && req.body.companyId && companyId !== req.body.companyId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: CompanyId in token does not match the requested companyId',
            });
        }

        let report;
        if (startDate && endDate && paymentTypeName) {
            report = await Report.findAllPayment(tenantId, startDate, endDate, paymentTypeName);
        } else {
            report = await Report.findAllPayment(tenantId);
        }

        let responseData = {
            success: true,
            message: 'Payment Report List Successfully!',
            data: report[0]
        };

        if (q) {
            const queryLowered = q.toLowerCase();
            const filteredData = responseData.data.filter(payment =>
                (payment.payment_type_name && payment.payment_type_name.toLowerCase().includes(queryLowered)) ||
                (payment.account_name && payment.account_name.toLowerCase().includes(queryLowered)) ||
                (payment.PaidAmount && payment.PaidAmount.toString().toLowerCase().includes(queryLowered)) ||
                (payment.ReceiveAmount && payment.ReceiveAmount.toString().toLowerCase().includes(queryLowered)) ||
                (payment.description && payment.description.toLowerCase().includes(queryLowered)) ||
                (payment.clientName && payment.clientName.toLowerCase().includes(queryLowered))
            );

            if (filteredData.length > 0) {
                responseData = {
                    ...responseData,
                    data: filteredData,
                    total: filteredData.length,
                };
            } else {
                responseData = {
                    ...responseData,
                    message: 'No matching Payment Report found',
                    data: [],
                    total: 0,
                };
            }
        }

        res.status(200).json(responseData);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const ListClientReport = async (req, res, next) => {
    const tokenInfo = getDecodeToken(req);

    if (!tokenInfo.success) {
        return res.status(401).json({
            success: false,
            message: tokenInfo.message,
        });
    }

    try {
        const { q = '' } = req.query;
        const { tenantId, companyId } = tokenInfo.decodedToken;
        const { startDate, endDate, clientName } = req.body;

        if (companyId && req.body.companyId && companyId !== req.body.companyId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: CompanyId in token does not match the requested companyId',
            });
        }

        let report;
        if (startDate && endDate) {
            report = await Report.findAllClient(tenantId, startDate, endDate, clientName);
        } else {
            report = await Report.findAllClient(tenantId, null, null, clientName);
        }

        // Filter out records where clientName is null
        // const filteredReport = report[0].filter(record => record.clientName !== null);

        let responseData = {
            success: true,
            message: 'Client Client List Successfully!',
            // data: filteredReport // Send the filtered report
            data: report[0]
        };

        if (q) {
            const queryLowered = q.toLowerCase();
            const filteredData = responseData.data.filter(client =>
                (client.payment_type_name && client.payment_type_name.toLowerCase().includes(queryLowered)) ||
                (client.account_name && client.account_name.toLowerCase().includes(queryLowered)) ||
                (client.PaidAmount && client.PaidAmount.toString().toLowerCase().includes(queryLowered)) ||
                (client.ReceiveAmount && client.ReceiveAmount.toString().toLowerCase().includes(queryLowered)) ||
                (client.description && client.description.toLowerCase().includes(queryLowered)) ||
                (client.clientName && client.clientName.toLowerCase().includes(queryLowered))
            );

            if (filteredData.length > 0) {
                responseData = {
                    ...responseData,
                    data: filteredData,
                    total: filteredData.length,
                };
            } else {
                responseData = {
                    ...responseData,
                    message: 'No matching Client Report found',
                    data: [],
                    total: 0,
                };
            }
        }

        res.status(200).json(responseData);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const ListCategoryReport = async (req, res, next) => {
    const tokenInfo = getDecodeToken(req);

    if (!tokenInfo.success) {
        return res.status(401).json({
            success: false,
            message: tokenInfo.message,
        });
    }

    try {
        const { q = '' } = req.query;
        const { tenantId, companyId } = tokenInfo.decodedToken;
        const { startDate, endDate, categoryName } = req.body;

        if (companyId && req.body.companyId && companyId !== req.body.companyId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: CompanyId in token does not match the requested companyId',
            });
        }

        let report;
        if (startDate && endDate && categoryName) {
            report = await Report.findAllCategory(tenantId, startDate, endDate, categoryName);
        } else {
            report = await Report.findAllCategory(tenantId);
        }

        let responseData = {
            success: true,
            message: 'Category Report List Successfully!',
            data: report[0]
        };

        if (q) {
            const queryLowered = q.toLowerCase();
            const filteredData = responseData.data.filter(category =>
                (category.payment_type_name && category.payment_type_name.toLowerCase().includes(queryLowered)) ||
                (category.account_name && category.account_name.toLowerCase().includes(queryLowered)) ||
                (category.PaidAmount && category.PaidAmount.toString().toLowerCase().includes(queryLowered)) ||
                (category.ReceiveAmount && category.ReceiveAmount.toString().toLowerCase().includes(queryLowered)) ||
                (category.description && category.description.toLowerCase().includes(queryLowered)) ||
                (category.clientName && category.clientName.toLowerCase().includes(queryLowered))
            );

            if (filteredData.length > 0) {
                responseData = {
                    ...responseData,
                    data: filteredData,
                    total: filteredData.length,
                };
            } else {
                responseData = {
                    ...responseData,
                    message: 'No matching Category Report found',
                    data: [],
                    total: 0,
                };
            }
        }

        res.status(200).json(responseData);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const ListAccountReport = async (req, res, next) => {
    const tokenInfo = getDecodeToken(req);

    if (!tokenInfo.success) {
        return res.status(401).json({
            success: false,
            message: tokenInfo.message,
        });
    }

    try {
        const { q = '' } = req.query;
        const { tenantId, companyId } = tokenInfo.decodedToken;
        const { startDate, endDate, accountName } = req.body;

        if (companyId && req.body.companyId && companyId !== req.body.companyId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: CompanyId in token does not match the requested companyId',
            });
        }

        let report;
        if (startDate && endDate && accountName) {
            report = await Report.findAllAccount(tenantId, startDate, endDate, accountName);
        } else {
            report = await Report.findAllAccount(tenantId);
        }

        let responseData = {
            success: true,
            message: 'Account Report List Successfully!',
            data: report[0]
        };

        if (q) {
            const queryLowered = q.toLowerCase();
            const filteredData = responseData.data.filter(account =>
                (account.payment_type_name && account.payment_type_name.toLowerCase().includes(queryLowered)) ||
                (account.account_name && account.account_name.toLowerCase().includes(queryLowered)) ||
                (account.PaidAmount && account.PaidAmount.toString().toLowerCase().includes(queryLowered)) ||
                (account.ReceiveAmount && account.ReceiveAmount.toString().toLowerCase().includes(queryLowered)) ||
                (account.description && account.description.toLowerCase().includes(queryLowered)) ||
                (account.clientName && account.clientName.toLowerCase().includes(queryLowered))
            );

            if (filteredData.length > 0) {
                responseData = {
                    ...responseData,
                    data: filteredData,
                    total: filteredData.length,
                };
            } else {
                responseData = {
                    ...responseData,
                    message: 'No matching Account Report found',
                    data: [],
                    total: 0,
                };
            }
        }

        res.status(200).json(responseData);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const ListGroupReport = async (req, res, next) => {
    const tokenInfo = getDecodeToken(req);

    if (!tokenInfo.success) {
        return res.status(401).json({
            success: false,
            message: tokenInfo.message,
        });
    }

    try {
        const { q = '' } = req.query;
        const { tenantId, companyId } = tokenInfo.decodedToken;
        const { startDate, endDate } = req.body;

        if (companyId && req.body.companyId && companyId !== req.body.companyId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: CompanyId in token does not match the requested companyId',
            });
        }

        let report;
        if (startDate && endDate) {
            report = await Report.findAllGroup(tenantId, startDate, endDate);
        } else {
            report = await Report.findAllGroup(tenantId);
        }

        let responseData = {
            success: true,
            message: 'Group Report List Successfully!',
            data: report[0]
        };

        if (q) {
            const queryLowered = q.toLowerCase();
            const filteredData = responseData.data.filter(group =>
                (group.payment_type_name && group.payment_type_name.toLowerCase().includes(queryLowered)) ||
                (group.account_name && group.account_name.toLowerCase().includes(queryLowered)) ||
                (group.PaidAmount && group.PaidAmount.toString().toLowerCase().includes(queryLowered)) ||
                (group.ReceiveAmount && group.ReceiveAmount.toString().toLowerCase().includes(queryLowered)) ||
                (group.description && group.description.toLowerCase().includes(queryLowered)) ||
                (group.clientName && group.clientName.toLowerCase().includes(queryLowered))
            );

            if (filteredData.length > 0) {
                responseData = {
                    ...responseData,
                    data: filteredData,
                    total: filteredData.length,
                };
            } else {
                responseData = {
                    ...responseData,
                    message: 'No matching Group Report found',
                    data: [],
                    total: 0,
                };
            }
        }

        res.status(200).json(responseData);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const ListCompanyReport = async (req, res, next) => {
    const tokenInfo = getDecodeToken(req);

    if (!tokenInfo.success) {
        return res.status(401).json({
            success: false,
            message: tokenInfo.message,
        });
    }

    try {
        const { q = '' } = req.query;
        const { tenantId, companyId } = tokenInfo.decodedToken;
        const { startDate, endDate } = req.body;

        if (companyId && req.body.companyId && companyId !== req.body.companyId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: CompanyId in token does not match the requested companyId',
            });
        }

        let report;
        if (startDate && endDate) {
            report = await Report.findAllCompany(tenantId, startDate, endDate);
        } else {
            report = await Report.findAllCompany(tenantId);
        }

        let responseData = {
            success: true,
            message: 'Company Report List Successfully!',
            data: report[0]
        };

        if (q) {
            const queryLowered = q.toLowerCase();
            const filteredData = responseData.data.filter(company =>
                (company.payment_type_name && company.payment_type_name.toLowerCase().includes(queryLowered)) ||
                (company.account_name && company.account_name.toLowerCase().includes(queryLowered)) ||
                (company.PaidAmount && company.PaidAmount.toString().toLowerCase().includes(queryLowered)) ||
                (company.ReceiveAmount && company.ReceiveAmount.toString().toLowerCase().includes(queryLowered)) ||
                (company.description && company.description.toLowerCase().includes(queryLowered)) ||
                (company.clientName && company.clientName.toLowerCase().includes(queryLowered))
            );

            if (filteredData.length > 0) {
                responseData = {
                    ...responseData,
                    data: filteredData,
                    total: filteredData.length,
                };
            } else {
                responseData = {
                    ...responseData,
                    message: 'No matching Company Report found',
                    data: [],
                    total: 0,
                };
            }
        }

        res.status(200).json(responseData);
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