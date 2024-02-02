const db = require('../db/dbconnection');

class reports {

    static async findAllPayment(tenantId, companyId, startDate = null, endDate = null, paymentTypeIds = null) {
        try {
            let sql;
            let params;

            if (startDate && endDate && paymentTypeIds && Array.isArray(paymentTypeIds) && paymentTypeIds.length > 0) {
                const paymentTypeIdsString = paymentTypeIds.join(',');
                sql = `CALL payment_wise_statement(?, ?, ?, ?, ?)`;
                params = [tenantId, startDate, endDate, paymentTypeIdsString, companyId];
            } else if (startDate && endDate && !paymentTypeIds) {
                sql = "CALL payment_wise_statement(?, ?, ?, NULL, ?)";
                params = [tenantId, startDate, endDate, companyId];
            } else {
                sql = "CALL payment_wise_statement(?, NULL, NULL, NULL, ?)";
                params = [tenantId, companyId];
            }

            const [result, _] = await db.execute(sql, params, { nullUndefined: true });
            return result;
        } catch (error) {
            console.error('Error in findAllAccount:', error);
            throw error;
        }
    };

    static async findAllClient(tenantId, companyId, startDate = null, endDate = null, clientTypeIds = null) {
        try {
            let sql;
            let params;

            if (startDate && endDate && clientTypeIds && Array.isArray(clientTypeIds) && clientTypeIds.length > 0) {
                const clientTypeIdsString = clientTypeIds.join(',');
                sql = `CALL client_wise_statement(?, ?, ?, ?, ?)`;
                params = [tenantId, startDate, endDate, clientTypeIdsString, companyId];
            } else if (startDate && endDate && !clientTypeIds) {
                sql = "CALL client_wise_statement(?, ?, ?, NULL, ?)";
                params = [tenantId, startDate, endDate, companyId];
            } else {
                sql = "CALL client_wise_statement(?, NULL, NULL, NULL, ?)";
                params = [tenantId, companyId];
            }

            const [result, _] = await db.execute(sql, params, { nullUndefined: true });
            return result;
        } catch (error) {
            console.error('Error in findAllAccount:', error);
            throw error;
        }
    };

    static async findAllCategory(tenantId, companyId, startDate = null, endDate = null, categoryTypeIds = null) {
        try {
            let sql;
            let params;

            if (startDate && endDate && categoryTypeIds && Array.isArray(categoryTypeIds) && categoryTypeIds.length > 0) {
                const categoryTypeIdsString = categoryTypeIds.join(',');
                sql = `CALL category_wise_statement(?, ?, ?, ?, ?)`;
                params = [tenantId, startDate, endDate, categoryTypeIdsString, companyId];
            } else if (startDate && endDate && !categoryTypeIds) {
                sql = "CALL category_wise_statement(?, ?, ?, NULL, ?)";
                params = [tenantId, startDate, endDate, companyId];
            } else {
                sql = "CALL category_wise_statement(?, NULL, NULL, NULL, ?)";
                params = [tenantId, companyId];
            }

            const [result, _] = await db.execute(sql, params, { nullUndefined: true });
            return result;
        } catch (error) {
            console.error('Error in findAllAccount:', error);
            throw error;
        }
    };

    static async findAllAccount(tenantId, companyId, startDate = null, endDate = null, accountTypeIds = null) {
        try {
            let sql;
            let params;

            if (startDate && endDate && accountTypeIds && Array.isArray(accountTypeIds) && accountTypeIds.length > 0) {
                const accountTypeIdsString = accountTypeIds.join(',');
                sql = `CALL account_wise_statement(?, ?, ?, ?, ?)`;
                params = [tenantId, startDate, endDate, accountTypeIdsString, companyId];
            } else if (startDate && endDate && !accountTypeIds) {
                sql = "CALL account_wise_statement(?, ?, ?, NULL, ?)";
                params = [tenantId, startDate, endDate, companyId];
            } else {
                sql = "CALL account_wise_statement(?, NULL, NULL, NULL, ?)";
                params = [tenantId, companyId];
            }

            const [result, _] = await db.execute(sql, params, { nullUndefined: true });
            return result;
        } catch (error) {
            console.error('Error in findAllAccount:', error);
            throw error;
        }
    };

    static async findAllGroup(tenantId, companyId, startDate = null, endDate = null) {
        try {
            let sql;
            let params;
            if (startDate && endDate) {
                sql = "CALL group_wise_statement(?, ?, ?, ?)";
                params = [tenantId, startDate, endDate, companyId];
            } else {
                sql = "CALL account_wise_statement(?, NULL, NULL, NULL, ?)";
                params = [tenantId, companyId];
            }

            const [result, _] = await db.execute(sql, params, { nullUndefined: true });
            return result;
        } catch (error) {
            console.error('Error in findAll:', error);
            throw error;
        }
    };
};

module.exports = reports;
