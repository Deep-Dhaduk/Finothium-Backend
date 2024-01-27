const db = require('../db/dbconnection');

class reports {

    static async findAllPayment(tenantId, startDate = null, endDate = null) {
        try {
            let sql;
            let params;

            if (startDate && endDate) {
                sql = "CALL payment_wise_statement(?, ?, ?)";
                params = [tenantId, startDate, endDate];
            } else {
                sql = "CALL payment_wise_statement_all(?)";
                params = [tenantId];
            }

            const [result, _] = await db.execute(sql, params, { nullUndefined: true });
            return result;
        } catch (error) {
            console.error('Error in findAll:', error);
            throw error;
        }
    };

    static async findAllClient(tenantId) {
        try {
            let sql = "CALL client_wise_statement(?)";
            const [result, _] = await db.execute(sql, [tenantId]);
            return result;
        } catch (error) {
            console.error('Error in findAll:', error);
            throw error;
        };
    };

    static async findAllCategory(tenantId) {
        try {
            let sql = "CALL category_wise_statement(?)";
            const [result, _] = await db.execute(sql, [tenantId]);
            return result;
        } catch (error) {
            console.error('Error in findAll:', error);
            throw error;
        };
    };

    static async findAllAccount(tenantId) {
        try {
            let sql = "CALL account_wise_statement(?)";
            const [result, _] = await db.execute(sql, [tenantId]);
            return result;
        } catch (error) {
            console.error('Error in findAll:', error);
            throw error;
        };
    };

    static async findAllGroup(tenantId) {
        try {
            let sql = "CALL group_wise_statement(?)";
            const [result, _] = await db.execute(sql, [tenantId]);
            return result;
        } catch (error) {
            console.error('Error in findAll:', error);
            throw error;
        };
    };

    static async findAllCompany(tenantId) {
        try {
            let sql = "CALL company_wise_statement(?)";
            const [result, _] = await db.execute(sql, [tenantId]);
            return result;
        } catch (error) {
            console.error('Error in findAll:', error);
            throw error;
        };
    };
};

module.exports = reports;
