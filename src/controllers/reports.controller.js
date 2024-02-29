const Report = require("../models/reports");
const { getDecodeToken } = require('../middlewares/decoded');

const reportTransaction = (transaction) => {
    const { id, transaction_date, transactionId, transaction_type, payment_type_Id, payment_type_name, clientId, clientName, type, accountId, account_name, group_name_Id, account_group_name, account_type_Id, account_type_name, description, PaidAmount, ReceiveAmount } = transaction;

    return {
        id,
        transactionDate: transaction_date,
        trasactionId: transactionId,
        transactionType: transaction_type,
        paymentTypeId: payment_type_Id,
        paymentTypeName: payment_type_name,
        clientId: clientId,
        clientName: clientName,
        type,
        accountId: accountId,
        accountName: account_name,
        groupId: group_name_Id,
        groupName: account_group_name,
        accountTypeId: account_type_Id,
        accountTypeName: account_type_name,
        description,
        paidAmount: +PaidAmount == 0 ? null : +PaidAmount,
        receiveAmount: +ReceiveAmount == 0 ? null : +ReceiveAmount
    };
};

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
        const companyId = tokenInfo.decodedToken.companyId;
        const { tenantId } = tokenInfo.decodedToken;
        const { startDate, endDate, paymentTypeIds, clientTypeIds, categoryTypeIds, accountIds, groupTypeIds, accountTypeIds } = req.body;

        if (companyId && req.body.companyId && companyId !== req.body.companyId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: CompanyId in token does not match the requested companyId',
            });
        }

        let reportType = null;

        let report = await Report.findAllPayment(tenantId, companyId, startDate, endDate, paymentTypeIds, clientTypeIds, categoryTypeIds, accountIds, groupTypeIds, accountTypeIds, reportType);

        const paymentMap = new Map();
        report[0].forEach(transaction => {
            const PaymentId = transaction.payment_type_Id;
            const PaymentName = transaction.payment_type_name;
            const PaidAmount = +(parseFloat(transaction.PaidAmount)).toFixed(2);
            const ReceiveAmount = +(parseFloat(transaction.ReceiveAmount)).toFixed(2);

            if (paymentMap.has(PaymentId)) {
                const existingData = paymentMap.get(PaymentId);
                existingData.PaidAmount = +(existingData.PaidAmount + PaidAmount).toFixed(2);
                existingData.ReceiveAmount = +(existingData.ReceiveAmount + ReceiveAmount).toFixed(2);
                existingData.BalanceAmount = +(existingData.ReceiveAmount - existingData.PaidAmount).toFixed(2);
                existingData.paymentDetails.push(reportTransaction(transaction));
            } else {
                paymentMap.set(PaymentId, {
                    PaymentId,
                    PaymentName,
                    PaidAmount,
                    ReceiveAmount,
                    BalanceAmount: +(ReceiveAmount - PaidAmount).toFixed(2),
                    paymentDetails: [reportTransaction(transaction)]
                });
            }
        });

        let responseData = {
            success: true,
            message: 'Payment Report List Successfully!',
            data: Array.from(paymentMap.values()).sort((a, b) => {
                const nameA = a.PaymentName.toUpperCase();
                const nameB = b.PaymentName.toUpperCase();

                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                return 0;
            })

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
        const companyId = tokenInfo.decodedToken.companyId;
        const { tenantId } = tokenInfo.decodedToken;
        const { startDate, endDate, clientTypeIds, paymentTypeIds, categoryTypeIds, accountIds, groupTypeIds, accountTypeIds } = req.body;
        if (companyId && req.body.companyId && companyId !== req.body.companyId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: CompanyId in token does not match the requested companyId',
            });
        }

        let reportType = "Client";

        let report = await Report.findAllClient(tenantId, companyId, startDate, endDate, clientTypeIds, paymentTypeIds, categoryTypeIds, accountIds, groupTypeIds, accountTypeIds, reportType);

        const clientMap = new Map();
        report[0].forEach(transaction => {
            const clientId = transaction.clientId;
            const clientName = transaction.clientName;
            const PaidAmount = +(parseFloat(transaction.PaidAmount)).toFixed(2);
            const ReceiveAmount = +(parseFloat(transaction.ReceiveAmount)).toFixed(2);

            if (clientMap.has(clientId)) {
                const existingData = clientMap.get(clientId);
                existingData.PaidAmount = +(existingData.PaidAmount + PaidAmount).toFixed(2);
                existingData.ReceiveAmount = +(existingData.ReceiveAmount + ReceiveAmount).toFixed(2);
                existingData.BalanceAmount = +(existingData.ReceiveAmount - existingData.PaidAmount).toFixed(2);
                existingData.paymentDetails.push(reportTransaction(transaction));
            } else {
                clientMap.set(clientId, {
                    clientId,
                    clientName,
                    PaidAmount,
                    ReceiveAmount,
                    BalanceAmount: +(ReceiveAmount - PaidAmount).toFixed(2),
                    paymentDetails: [reportTransaction(transaction)]
                });
            }
        });

        let responseData = {
            success: true,
            message: 'Client Report List Successfully!',
            data: Array.from(clientMap.values()).sort((a, b) => {
                const nameA = a.clientName.toUpperCase();
                const nameB = b.clientName.toUpperCase();

                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                return 0;
            })
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
        const companyId = tokenInfo.decodedToken.companyId;
        const { tenantId } = tokenInfo.decodedToken;
        const { startDate, endDate, categoryTypeIds, paymentTypeIds, clientTypeIds, accountIds, groupTypeIds, accountTypeIds } = req.body;
        if (companyId && req.body.companyId && companyId !== req.body.companyId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: CompanyId in token does not match the requested companyId',
            });
        }

        let reportType = "Category";

        let report = await Report.findAllCategory(tenantId, companyId, startDate, endDate, categoryTypeIds, paymentTypeIds, clientTypeIds, accountIds, groupTypeIds, accountTypeIds, reportType);

        const clientMap = new Map();
        report[0].forEach(transaction => {
            const clientId = transaction.clientId;
            const clientName = transaction.clientName;
            const PaidAmount = +(parseFloat(transaction.PaidAmount)).toFixed(2);
            const ReceiveAmount = +(parseFloat(transaction.ReceiveAmount)).toFixed(2);

            if (clientMap.has(clientId)) {
                const existingData = clientMap.get(clientId);
                existingData.PaidAmount = +(existingData.PaidAmount + PaidAmount).toFixed(2);
                existingData.ReceiveAmount = +(existingData.ReceiveAmount + ReceiveAmount).toFixed(2);
                existingData.BalanceAmount = +(existingData.ReceiveAmount - existingData.PaidAmount).toFixed(2);
                existingData.paymentDetails.push(reportTransaction(transaction));
            } else {
                clientMap.set(clientId, {
                    clientId,
                    clientName,
                    PaidAmount,
                    ReceiveAmount,
                    BalanceAmount: +(ReceiveAmount - PaidAmount).toFixed(2),
                    paymentDetails: [reportTransaction(transaction)]
                });
            }
        });

        let responseData = {
            success: true,
            message: 'Category Report List Successfully!',
            data: Array.from(clientMap.values()).sort((a, b) => {
                const nameA = a.clientName.toUpperCase();
                const nameB = b.clientName.toUpperCase();

                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                return 0;
            })
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
        const companyId = tokenInfo.decodedToken.companyId;
        const { tenantId } = tokenInfo.decodedToken;
        const { startDate, endDate, accountIds, paymentTypeIds, clientTypeIds, categoryTypeIds, groupTypeIds, accountTypeIds } = req.body;

        if (companyId && req.body.companyId && companyId !== req.body.companyId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: CompanyId in token does not match the requested companyId',
            });
        }

        let reportType = null;

        let report = await Report.findAllAccount(tenantId, companyId, startDate, endDate, paymentTypeIds, clientTypeIds, categoryTypeIds, accountIds, groupTypeIds, accountTypeIds, reportType);

        const accountMap = new Map();
        report[0].forEach(transaction => {
            const accountId = transaction.accountId;
            const accountName = transaction.account_name;
            const PaidAmount = +(parseFloat(transaction.PaidAmount)).toFixed(2);
            const ReceiveAmount = +(parseFloat(transaction.ReceiveAmount)).toFixed(2);

            if (accountMap.has(accountId)) {
                const existingData = accountMap.get(accountId);
                existingData.PaidAmount = +(existingData.PaidAmount + PaidAmount).toFixed(2);
                existingData.ReceiveAmount = +(existingData.ReceiveAmount + ReceiveAmount).toFixed(2);
                existingData.BalanceAmount = +(existingData.ReceiveAmount - existingData.PaidAmount).toFixed(2);
                existingData.accounts.push(reportTransaction(transaction));
            } else {
                accountMap.set(accountId, {
                    accountId,
                    accountName,
                    PaidAmount,
                    ReceiveAmount,
                    BalanceAmount: +(ReceiveAmount - PaidAmount).toFixed(2),
                    accounts: [reportTransaction(transaction)]
                });
            }
        });

        const responseData = {
            success: true,
            message: 'Account Report List Successfully!',
            data: Array.from(accountMap.values()).sort((a, b) => {
                const nameA = a.accountName.toUpperCase();
                const nameB = b.accountName.toUpperCase();

                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                return 0;
            })
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

    try {
        const { q = '' } = req.query;
        const companyId = tokenInfo.decodedToken.companyId;

        const { tenantId } = tokenInfo.decodedToken;
        const { startDate, endDate, groupTypeIds, paymentTypeIds, clientTypeIds, categoryTypeIds, accountIds, accountTypeIds } = req.body;

        if (companyId && req.body.companyId && companyId !== req.body.companyId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: CompanyId in token does not match the requested companyId',
            });
        }

        let reportType = null;

        let report = await Report.findAllGroup(tenantId, companyId, startDate, endDate, paymentTypeIds, clientTypeIds, categoryTypeIds, accountIds, groupTypeIds, accountTypeIds, reportType);

        const groupMap = new Map();
        report[0].forEach(transaction => {
            const GroupId = transaction.group_name_Id;
            const GroupName = transaction.account_group_name;
            const PaidAmount = +(parseFloat(transaction.PaidAmount)).toFixed(2);
            const ReceiveAmount = +(parseFloat(transaction.ReceiveAmount)).toFixed(2);

            if (groupMap.has(GroupId)) {
                const existingData = groupMap.get(GroupId);
                existingData.PaidAmount = +(existingData.PaidAmount + PaidAmount).toFixed(2);
                existingData.ReceiveAmount = +(existingData.ReceiveAmount + ReceiveAmount).toFixed(2);
                existingData.BalanceAmount = +(existingData.ReceiveAmount - existingData.PaidAmount).toFixed(2);
                existingData.groupDetails.push(reportTransaction(transaction));
            } else {
                groupMap.set(GroupId, {
                    GroupId,
                    GroupName,
                    PaidAmount,
                    ReceiveAmount,
                    BalanceAmount: +(ReceiveAmount - PaidAmount).toFixed(2),
                    groupDetails: [reportTransaction(transaction)]
                });
            }
        });

        let responseData = {
            success: true,
            message: 'Group Report List Successfully!',
            data: Array.from(groupMap.values()).sort((a, b) => {
                const nameA = a.GroupName.toUpperCase();
                const nameB = b.GroupName.toUpperCase();

                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                return 0;
            })
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
        const companyId = tokenInfo.decodedToken.companyId;
        const { tenantId } = tokenInfo.decodedToken;
        const { startDate, endDate, clientTypeIds, paymentTypeIds, categoryTypeIds, accountIds, groupTypeIds } = req.body;
        if (companyId && req.body.companyId && companyId !== req.body.companyId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: CompanyId in token does not match the requested companyId',
            });
        }

        let reportType = null;

        let report = await Report.findAllCompany(tenantId, companyId, startDate, endDate, clientTypeIds, paymentTypeIds, categoryTypeIds, accountIds, groupTypeIds, reportType);

        let responseData = {
            success: true,
            message: 'Company Report List Successfully!',
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

const ListAccountTypeReport = async (req, res, next) => {
    const tokenInfo = getDecodeToken(req);

    if (!tokenInfo.success) {
        return res.status(401).json({
            success: false,
            message: tokenInfo.message,
        });
    }

    try {
        const { q = '' } = req.query;
        const companyId = tokenInfo.decodedToken.companyId;
        const { tenantId } = tokenInfo.decodedToken;
        const { startDate, endDate, paymentTypeIds, clientTypeIds, categoryTypeIds, accountIds, groupTypeIds, accountTypeIds } = req.body;

        if (companyId && req.body.companyId && companyId !== req.body.companyId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: CompanyId in token does not match the requested companyId',
            });
        }

        let reportType = null;

        let report = await Report.findAllAccountType(tenantId, companyId, startDate, endDate, paymentTypeIds, clientTypeIds, categoryTypeIds, accountIds, groupTypeIds, accountTypeIds, reportType);

        const accountTypeMap = new Map();
        report[0].forEach(transaction => {
            const accountTypeId = transaction.account_type_Id;
            const accountTypeName = transaction.account_type_name;
            const PaidAmount = +(parseFloat(transaction.PaidAmount)).toFixed(2);
            const ReceiveAmount = +(parseFloat(transaction.ReceiveAmount)).toFixed(2);

            if (accountTypeMap.has(accountTypeId)) {
                const existingData = accountTypeMap.get(accountTypeId);
                existingData.PaidAmount = +(existingData.PaidAmount + PaidAmount).toFixed(2);
                existingData.ReceiveAmount = +(existingData.ReceiveAmount + ReceiveAmount).toFixed(2);
                existingData.BalanceAmount = +(existingData.ReceiveAmount - existingData.PaidAmount).toFixed(2);
                existingData.paymentDetails.push(reportTransaction(transaction));
            } else {
                accountTypeMap.set(accountTypeId, {
                    accountTypeId,
                    accountTypeName,
                    PaidAmount,
                    ReceiveAmount,
                    BalanceAmount: +(ReceiveAmount - PaidAmount).toFixed(2),
                    paymentDetails: [reportTransaction(transaction)]
                });
            }
        });

        let responseData = {
            success: true,
            message: 'Account Type Report List Successfully!',
            data: Array.from(accountTypeMap.values()).sort((a, b) => {
                const nameA = a.accountTypeName.toUpperCase();
                const nameB = b.accountTypeName.toUpperCase();

                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                return 0;
            })

        };
        if (q) {
            const queryLowered = q.toLowerCase();
            const filteredData = responseData.data.filter(accountType =>
                (accountType.payment_type_name && accountType.payment_type_name.toLowerCase().includes(queryLowered)) ||
                (accountType.account_name && accountType.account_name.toLowerCase().includes(queryLowered)) ||
                (accountType.PaidAmount && accountType.PaidAmount.toString().toLowerCase().includes(queryLowered)) ||
                (accountType.ReceiveAmount && accountType.ReceiveAmount.toString().toLowerCase().includes(queryLowered)) ||
                (accountType.description && accountType.description.toLowerCase().includes(queryLowered)) ||
                (accountType.clientName && accountType.clientName.toLowerCase().includes(queryLowered))
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
                    message: 'No matching Account Type Report found',
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
    ListCompanyReport,
    ListAccountTypeReport
}
