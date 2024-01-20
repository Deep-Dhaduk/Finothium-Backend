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

        // Add companyId check to ensure the companyId in the token matches the one used in the query
        if (companyId && req.query.companyId && companyId !== req.query.companyId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: CompanyId in token does not match the requested companyId',
            });
        }

        const report = await Report.findAllPayment(tenantId, companyId);
        let responseData = {
            success: true,
            message: 'Payment Report List Successfully!',
            data: report[0],
        };

        if (q) {
            const queryLowered = q.toLowerCase();
            const filteredData = report[0].filter(payment =>
                (payment.client_category_name && payment.client_category_name.toLowerCase().includes(queryLowered)) ||
                (payment.payment_type && payment.payment_type.toLowerCase().includes(queryLowered)) ||
                (payment.account_name && payment.account_name.toLowerCase().includes(queryLowered)) ||
                (payment.paid_amount && payment.paid_amount.toLowerCase().includes(queryLowered)) ||
                (payment.receive_amount && payment.receive_amount.toLowerCase().includes(queryLowered)) ||
                (payment.description && payment.description.toLowerCase().includes(queryLowered))
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
    const token = getDecodeToken(req);
    try {
        const { q = '' } = req.query;

        const report = await Report.findAllClient(token.tenantId);
        let responseData = {
            success: true,
            message: 'Client Report List Successfully!',
            data: report[0]
        };

        if (q) {
            const queryLowered = q.toLowerCase();
            const filteredData = report[0].filter(client =>
                (client.client_category_name && client.client_category_name.toLowerCase().includes(queryLowered)) ||
                (client.payment_type && client.payment_type.toLowerCase().includes(queryLowered)) ||
                (client.account_name && client.account_name.toLowerCase().includes(queryLowered)) ||
                (client.paid_amount && client.paid_amount.toLowerCase().includes(queryLowered)) ||
                (client.receive_amount && client.receive_amount.toLowerCase().includes(queryLowered)) ||
                (client.description && client.description.toLowerCase().includes(queryLowered))
            );

            if (filteredData.length > 0) {
                responseData = {
                    ...responseData,
                    data: filteredData,
                    total: filteredData.length
                };
            } else {
                responseData = {
                    ...responseData,
                    message: 'No matching category Report found',
                    data: [],
                    total: 0
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
    const token = getDecodeToken(req);
    try {
        const { q = '' } = req.query;

        const report = await Report.findAllCategory(token.tenantId);
        let responseData = {
            success: true,
            message: 'Category Report List Successfully!',
            data: report[0]
        };

        if (q) {
            const queryLowered = q.toLowerCase();
            const filteredData = report[0].filter(category =>
                (category.client_category_name && category.client_category_name.toLowerCase().includes(queryLowered)) ||
                (category.payment_type && category.payment_type.toLowerCase().includes(queryLowered)) ||
                (category.account_name && category.account_name.toLowerCase().includes(queryLowered)) ||
                (category.paid_amount && category.paid_amount.toLowerCase().includes(queryLowered)) ||
                (category.receive_amount && category.receive_amount.toLowerCase().includes(queryLowered)) ||
                (category.description && category.description.toLowerCase().includes(queryLowered))
            );

            if (filteredData.length > 0) {
                responseData = {
                    ...responseData,
                    data: filteredData,
                    total: filteredData.length
                };
            } else {
                responseData = {
                    ...responseData,
                    message: 'No matching category Report found',
                    data: [],
                    total: 0
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
    const token = getDecodeToken(req);
    try {
        const { q = '' } = req.query;

        const report = await Report.findAllAccount(token.tenantId);
        let responseData = {
            success: true,
            message: 'Account Report List Successfully!',
            data: report[0]
        };

        if (q) {
            const queryLowered = q.toLowerCase();
            const filteredData = report[0].filter(account =>
                (account.client_category_name && account.client_category_name.toLowerCase().includes(queryLowered)) ||
                (account.payment_type && account.payment_type.toLowerCase().includes(queryLowered)) ||
                (account.account_name && account.account_name.toLowerCase().includes(queryLowered)) ||
                (account.paid_amount && account.paid_amount.toLowerCase().includes(queryLowered)) ||
                (account.receive_amount && account.receive_amount.toLowerCase().includes(queryLowered)) ||
                (account.description && account.description.toLowerCase().includes(queryLowered))
            );

            if (filteredData.length > 0) {
                responseData = {
                    ...responseData,
                    data: filteredData,
                    total: filteredData.length
                };
            } else {
                responseData = {
                    ...responseData,
                    message: 'No matching account Report found',
                    data: [],
                    total: 0
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
    const token = getDecodeToken(req);
    try {
        const { q = '' } = req.query;

        const report = await Report.findAllGroup(token.tenantId);
        let responseData = {
            success: true,
            message: 'Group Report List Successfully!',
            data: report[0]
        };

        if (q) {
            const queryLowered = q.toLowerCase();
            const filteredData = report[0].filter(group =>
                (group.client_category_name && group.client_category_name.toLowerCase().includes(queryLowered)) ||
                (group.payment_type && group.payment_type.toLowerCase().includes(queryLowered)) ||
                (group.account_name && group.account_name.toLowerCase().includes(queryLowered)) ||
                (group.paid_amount && group.paid_amount.toLowerCase().includes(queryLowered)) ||
                (group.receive_amount && group.receive_amount.toLowerCase().includes(queryLowered)) ||
                (group.description && group.description.toLowerCase().includes(queryLowered))
            );

            if (filteredData.length > 0) {
                responseData = {
                    ...responseData,
                    data: filteredData,
                    total: filteredData.length
                };
            } else {
                responseData = {
                    ...responseData,
                    message: 'No matching group Report found',
                    data: [],
                    total: 0
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
    const token = getDecodeToken(req);
    try {
        const { q = '' } = req.query;

        const report = await Report.findAllCompany(token.tenantId);
        let responseData = {
            success: true,
            message: 'Company Report List Successfully!',
            data: report[0]
        };

        if (q) {
            const queryLowered = q.toLowerCase();
            const filteredData = report[0].filter(company =>
                (company.client_category_name && company.client_category_name.toLowerCase().includes(queryLowered)) ||
                (company.payment_type && company.payment_type.toLowerCase().includes(queryLowered)) ||
                (company.account_name && company.account_name.toLowerCase().includes(queryLowered)) ||
                (company.paid_amount && company.paid_amount.toLowerCase().includes(queryLowered)) ||
                (company.receive_amount && company.receive_amount.toLowerCase().includes(queryLowered)) ||
                (company.description && company.description.toLowerCase().includes(queryLowered))
            );

            if (filteredData.length > 0) {
                responseData = {
                    ...responseData,
                    data: filteredData,
                    total: filteredData.length
                };
            } else {
                responseData = {
                    ...responseData,
                    message: 'No matching company Report found',
                    data: [],
                    total: 0
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