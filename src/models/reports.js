const db = require('../db/dbconnection');

class reports {

    static async findAllPayment(tenantId, companyId, startDate = null, endDate = null, paymentTypeIds = null) {
        try {
            let sql;
            let params;

            if (startDate && endDate && paymentTypeIds && Array.isArray(paymentTypeIds) && paymentTypeIds.length > 0) {
                const paymentTypeIdsString = paymentTypeIds.join(',');
                sql = `CALL report_statement(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                params = [tenantId, companyId, startDate, endDate, paymentTypeIdsString, null, null, null, null];
            } else if (startDate && endDate && !paymentTypeIds) {
                sql = "CALL report_statement(?, ?, ?, ?, NULL, ?, ?, ?, ?)";
                params = [tenantId, companyId, startDate, endDate, null, null, null, null];
            } else {
                sql = "CALL report_statement(?, ?, ?, ?, NULL, ?, ?, ?, ?)";
                params = [tenantId, companyId, null, null, null, null, null, null];
            }

            const [result, _] = await db.execute(sql, params, { nullUndefined: true });
            return result;
        } catch (error) {
            console.error('Error in findAllAccount:', error);
            throw error;
        };
    };

    static async findAllClient(tenantId, companyId, startDate = null, endDate = null, clientTypeIds = null) {
        try {
            let sql;
            let params;

            if (startDate && endDate && clientTypeIds && Array.isArray(clientTypeIds) && clientTypeIds.length > 0) {
                const clientTypeIdsString = clientTypeIds.join(',');
                sql = `CALL report_statement(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                params = [tenantId, companyId, startDate, endDate, null, clientTypeIdsString, null, null, null];
            } else if (startDate && endDate && !clientTypeIds) {
                sql = "CALL report_statement(?, ?, ?, ?, ?, NULL, ?, ?, ?)";
                params = [tenantId, companyId, startDate, endDate, null, null, null, null];
            } else {
                sql = "CALL report_statement(?, ?, ?, ?, ?, NULL, ?, ?, ?)";
                params = [tenantId, companyId, null, null, null, null, null, null];
            }

            const [result, _] = await db.execute(sql, params, { nullUndefined: true });
            return result;
        } catch (error) {
            console.error('Error in findAllAccount:', error);
            throw error;
        };
    };

    static async findAllCategory(tenantId, companyId, startDate = null, endDate = null, categoryTypeIds = null) {
        try {
            let sql;
            let params;

            if (startDate && endDate && categoryTypeIds && Array.isArray(categoryTypeIds) && categoryTypeIds.length > 0) {
                const categoryTypeIdsString = categoryTypeIds.join(',');
                sql = `CALL report_statement(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                params = [tenantId, companyId, startDate, endDate, null, null, categoryTypeIdsString, null, null];
            } else if (startDate && endDate && !categoryTypeIds) {
                sql = "CALL report_statement(?, ?, ?, ?, ?, ?, NULL, ?, ?)";
                params = [tenantId, companyId, startDate, endDate, null, null, null, null];
            } else {
                sql = "CALL report_statement(?, ?, ?, ?, ?, ?, NULL, ?, ?)";
                params = [tenantId, companyId, null, null, null, null, null, null];
            }

            const [result, _] = await db.execute(sql, params, { nullUndefined: true });
            return result;
        } catch (error) {
            console.error('Error in findAllAccount:', error);
            throw error;
        };
    };

    static async findAllAccount(tenantId, companyId, startDate = null, endDate = null, accountTypeIds = null) {
        try {
            let sql;
            let params;

            if (startDate && endDate && accountTypeIds && Array.isArray(accountTypeIds) && accountTypeIds.length > 0) {
                const accountTypeIdsString = accountTypeIds.join(',');
                sql = `CALL report_statement(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                params = [tenantId, companyId, startDate, endDate, null, null, null, accountTypeIdsString, null];
            } else if (startDate && endDate && !accountTypeIds) {
                sql = "CALL report_statement(?, ?, ?, ?, ?, ?, ?, NULL, ?)";
                params = [tenantId, companyId, startDate, endDate, null, null, null, null];
            }
            else if ((startDate === null && endDate !== null || startDate !== null && endDate === null) && !accountTypeIds) {
                sql = "CALL report_statement(?, ?, ?, ?, ?, ?, ?, NULL, ?)";
                params = [tenantId, companyId, startDate, endDate, null, null, null, null, null];
            }
            else {
                sql = "CALL report_statement(?, ?, ?, ?, ?, ?, ?, NULL, ?)";
                params = [tenantId, companyId, null, null, null, null, null, null];
            }

            const [result, _] = await db.execute(sql, params, { nullUndefined: true });
            return result;
        } catch (error) {
            console.error('Error in findAllAccount:', error);
            throw error;
        };
    };

    static async findAllGroup(tenantId, companyId, startDate = null, endDate = null, groupTypeIds = null) {
        try {
            let sql;
            let params;

            if (startDate && endDate && groupTypeIds && Array.isArray(groupTypeIds) && groupTypeIds.length > 0) {
                const groupTypeIdsString = groupTypeIds.join(',');
                sql = `CALL report_statement(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                params = [tenantId, companyId, startDate, endDate, null, null, null, null, groupTypeIdsString];
            } else if (startDate && endDate && !groupTypeIds) {
                sql = "CALL report_statement(?, ?, ?, ?, ?, ?, ?, ?, NULL)";
                params = [tenantId, companyId, startDate, endDate, null, null, null, null];
            } else {
                sql = "CALL report_statement(?, ?, ?, ?, ?, ?, ?, ?, NULL)";
                params = [tenantId, companyId, null, null, null, null, null, null];
            }

            const [result, _] = await db.execute(sql, params, { nullUndefined: true });
            return result;
        } catch (error) {
            console.error('Error in findAllAccount:', error);
            throw error;
        };
    };
};

module.exports = reports;