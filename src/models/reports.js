const db = require('../db/dbconnection');

class reports {

    static async findAllPayment(tenantId, startDate = null, endDate = null, paymentTypeName = null) {
        try {
            let sql;
            let params;

            if (startDate && endDate && paymentTypeName) {
                sql = "CALL payment_wise_statement(?, ?, ?, ?)";
                params = [tenantId, startDate, endDate, paymentTypeName];
            } else if (startDate && endDate) {
                sql = "CALL payment_wise_statement(?, ?, ?)";
                params = [tenantId, startDate, endDate];
            } else {
                sql = "CALL all_statement(?)";
                params = [tenantId];
            }

            const [result, _] = await db.execute(sql, params, { nullUndefined: true });
            return result;
        } catch (error) {
            console.error('Error in findAll:', error);
            throw error;
        }
    };

    static async findAllClient(tenantId, startDate = null, endDate = null, clientName = null) {
        try {
            let sql;
            let params;

            if (startDate && endDate && clientName) {
                sql = "CALL client_wise_statement(?, ?, ?, ?)";
                params = [tenantId, startDate, endDate, clientName];
            } else if (startDate && endDate) {
                sql = "CALL client_wise_statement(?, ?, ?)";
                params = [tenantId, startDate, endDate];
            } else {
                sql = "CALL all_statement(?)";
                params = [tenantId];
            }

            const [result, _] = await db.execute(sql, params, { nullUndefined: true });
            return result;
        } catch (error) {
            console.error('Error in findAll:', error);
            throw error;
        }
    };

    static async findAllCategory(tenantId, startDate = null, endDate = null, categoryName = null) {
        try {
            let sql;
            let params;

            if (startDate && endDate && categoryName) {
                sql = "CALL client_wise_statement(?, ?, ?, ?)";
                params = [tenantId, startDate, endDate, categoryName];
            } else if (startDate && endDate) {
                sql = "CALL client_wise_statement(?, ?, ?)";
                params = [tenantId, startDate, endDate];
            } else {
                sql = "CALL all_statement(?)";
                params = [tenantId];
            }

            const [result, _] = await db.execute(sql, params, { nullUndefined: true });
            return result;
        } catch (error) {
            console.error('Error in findAll:', error);
            throw error;
        }
    };

    static async findAllAccount(tenantId, startDate = null, endDate = null, accountName = null) {
        try {
            let sql;
            let params;

            if (startDate && endDate && accountName) {
                sql = "CALL account_wise_statement(?, ?, ?, ?)";
                params = [tenantId, startDate, endDate, accountName];
            } else if (startDate && endDate) {
                sql = "CALL account_wise_statement(?, ?, ?)";
                params = [tenantId, startDate, endDate];
            } else {
                sql = "CALL all_statement(?)";
                params = [tenantId];
            }

            const [result, _] = await db.execute(sql, params, { nullUndefined: true });
            return result;
        } catch (error) {
            console.error('Error in findAll:', error);
            throw error;
        }
    };

    static async findAllGroup(tenantId, startDate = null, endDate = null) {
        try {
            let sql;
            let params;
            if (startDate && endDate) {
                sql = "CALL group_wise_statement(?, ?, ?)";
                params = [tenantId, startDate, endDate];
            } else {
                sql = "CALL all_statement(?)";
                params = [tenantId];
            }

            const [result, _] = await db.execute(sql, params, { nullUndefined: true });
            return result;
        } catch (error) {
            console.error('Error in findAll:', error);
            throw error;
        }
    };

    static async findAllCompany(tenantId, startDate = null, endDate = null) {
        try {
            let sql;
            let params;

            if (startDate && endDate) {
                sql = "CALL company_wise_statement(?, ?, ?)";
                params = [tenantId, startDate, endDate];
            } else {
                sql = "CALL all_statement(?)";
                params = [tenantId];
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
