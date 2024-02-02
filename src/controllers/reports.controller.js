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
        const companyId = tokenInfo.decodedToken.company.companyId;
        const { tenantId } = tokenInfo.decodedToken;
        const { startDate, endDate, paymentTypeIds } = req.body;
        if (companyId && req.body.companyId && companyId !== req.body.companyId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: CompanyId in token does not match the requested companyId',
            });
        }

        let report;
        if (startDate && endDate && paymentTypeIds) {
            report = await Report.findAllPayment(tenantId, companyId, startDate, endDate, paymentTypeIds);
        } else if (startDate && endDate) {
            report = await Report.findAllPayment(tenantId, companyId, startDate, endDate, null);
        } else {
            report = await Report.findAllPayment(tenantId, companyId);
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
        const companyId = tokenInfo.decodedToken.company.companyId;
        const { tenantId } = tokenInfo.decodedToken;
        const { startDate, endDate, clientTypeIds } = req.body;
        if (companyId && req.body.companyId && companyId !== req.body.companyId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: CompanyId in token does not match the requested companyId',
            });
        }

        let report;
        if (startDate && endDate && clientTypeIds) {
            report = await Report.findAllClient(tenantId, companyId, startDate, endDate, clientTypeIds);
            report[0] = report[0].filter(client => client.clientId !== null && client.clientName !== null);
        } else if (startDate && endDate) {
            report = await Report.findAllAccount(tenantId, companyId, startDate, endDate, null);
        } else {
            report = await Report.findAllClient(tenantId, companyId);
        }

        let responseData = {
            success: true,
            message: 'Client Report List Successfully!',
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
        const companyId = tokenInfo.decodedToken.company.companyId
        const { tenantId } = tokenInfo.decodedToken;
        const { startDate, endDate, categoryTypeIds } = req.body;
        if (companyId && req.body.companyId && companyId !== req.body.companyId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: CompanyId in token does not match the requested companyId',
            });
        }

        let report;
        if (startDate && endDate && categoryTypeIds) {
            report = await Report.findAllCategory(tenantId, companyId, startDate, endDate, categoryTypeIds);
        } else if (startDate && endDate) {
            report = await Report.findAllCategory(tenantId, companyId, startDate, endDate, null);
        } else {
            report = await Report.findAllCategory(tenantId, companyId);
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
        const companyId = tokenInfo.decodedToken.company.companyId
        const { tenantId } = tokenInfo.decodedToken;
        const { startDate, endDate, accountTypeIds } = req.body;
        if (companyId && req.body.companyId && companyId !== req.body.companyId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: CompanyId in token does not match the requested companyId',
            });
        }

        let report;
        if (startDate && endDate && accountTypeIds) {
            report = await Report.findAllAccount(tenantId, companyId, startDate, endDate, accountTypeIds);
        } else if (startDate && endDate) {
            report = await Report.findAllAccount(tenantId, companyId, startDate, endDate, null);
        } else {
            report = await Report.findAllAccount(tenantId, companyId);
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
        const companyId = tokenInfo.decodedToken.company.companyId;
        const { tenantId } = tokenInfo.decodedToken;
        const { startDate, endDate } = req.body;

        if (companyId && req.body.companyId && companyId !== req.body.companyId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: CompanyId in token does not match the requested companyId',
            });
        }

        let report;
        if (startDate && endDate) {
            report = await Report.findAllGroup(tenantId, companyId, startDate, endDate);
        } else {
            report = await Report.findAllGroup(tenantId, companyId);
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

module.exports = {
    ListPaymentReport,
    ListClientReport,
    ListCategoryReport,
    ListAccountReport,
    ListGroupReport
}