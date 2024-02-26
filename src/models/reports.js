const db = require('../db/dbconnection');

class reports {

    static async findAllPayment(tenantId, companyId, startDate = null, endDate = null, paymentTypeIds = null, clientTypeIds = null, categoryTypeIds = null, accountIds = null, groupTypeIds = null, accountTypeIds = null, reportTypes = null) {
        try {

            let sql;
            let params;

            const paymentTypeIdsString = Array.isArray(paymentTypeIds) && paymentTypeIds.length > 0 ? paymentTypeIds.join(',') : null;
            const clientTypeIdsString = Array.isArray(clientTypeIds) && clientTypeIds.length > 0 ? clientTypeIds.join(',') : null;
            const categoryTypeIdsString = Array.isArray(categoryTypeIds) && categoryTypeIds.length > 0 ? categoryTypeIds.join(',') : null;
            const accountIdsString = Array.isArray(accountIds) && accountIds.length > 0 ? accountIds.join(',') : null;
            const groupTypeIdsString = Array.isArray(groupTypeIds) && groupTypeIds.length > 0 ? groupTypeIds.join(',') : null;
            const accountTypeIdsString = Array.isArray(accountTypeIds) && accountTypeIds.length > 0 ? accountTypeIds.join(',') : null;
            sql = `CALL report_statement(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            params = [tenantId, companyId, startDate, endDate, paymentTypeIdsString, clientTypeIdsString, categoryTypeIdsString, accountIdsString, groupTypeIdsString, accountTypeIdsString, reportTypes];

            const [result, _] = await db.execute(sql, params, { nullUndefined: true });
            return result;
        } catch (error) {
            console.error('Error in findAll Account:', error);
            throw error;
        };
    };

    static async findAllClient(tenantId, companyId, startDate = null, endDate = null, clientTypeIds = null, paymentTypeIds = null, categoryTypeIds = null, accountIds = null, groupTypeIds = null, accountTypeIds = null) {
        try {

            const reportTypes = "Client";

            let sql;
            let params;

            const clientTypeIdsString = Array.isArray(clientTypeIds) && clientTypeIds.length > 0 ? clientTypeIds.join(',') : null;
            const paymentTypeIdsString = Array.isArray(paymentTypeIds) && paymentTypeIds.length > 0 ? paymentTypeIds.join(',') : null;
            const categoryTypeIdsString = Array.isArray(categoryTypeIds) && categoryTypeIds.length > 0 ? categoryTypeIds.join(',') : null;
            const accountIdsString = Array.isArray(accountIds) && accountIds.length > 0 ? accountIds.join(',') : null;
            const groupTypeIdsString = Array.isArray(groupTypeIds) && groupTypeIds.length > 0 ? groupTypeIds.join(',') : null;
            const accountTypeIdsString = Array.isArray(accountTypeIds) && accountTypeIds.length > 0 ? accountTypeIds.join(',') : null;
            sql = `CALL report_statement(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            params = [tenantId, companyId, startDate, endDate, paymentTypeIdsString, clientTypeIdsString, categoryTypeIdsString, accountIdsString, groupTypeIdsString, accountTypeIdsString, reportTypes];

            const [result, _] = await db.execute(sql, params, { nullUndefined: true });
            return result;
        } catch (error) {
            console.error('Error in findAllAccount:', error);
            throw error;
        };
    };

    static async findAllCategory(tenantId, companyId, startDate = null, endDate = null, categoryTypeIds = null, paymentTypeIds = null, clientTypeIds = null, accountIds = null, groupTypeIds = null, accountTypeIds = null) {
        try {

            const reportTypes = "Category";

            let sql;
            let params;

            const categoryTypeIdsString = Array.isArray(categoryTypeIds) && categoryTypeIds.length > 0 ? categoryTypeIds.join(',') : null;
            const paymentTypeIdsString = Array.isArray(paymentTypeIds) && paymentTypeIds.length > 0 ? paymentTypeIds.join(',') : null;
            const clientTypeIdsString = Array.isArray(clientTypeIds) && clientTypeIds.length > 0 ? clientTypeIds.join(',') : null;
            const accountIdsString = Array.isArray(accountIds) && accountIds.length > 0 ? accountIds.join(',') : null;
            const groupTypeIdsString = Array.isArray(groupTypeIds) && groupTypeIds.length > 0 ? groupTypeIds.join(',') : null;
            const accountTypeIdsString = Array.isArray(accountTypeIds) && accountTypeIds.length > 0 ? accountTypeIds.join(',') : null;
            sql = `CALL report_statement(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            params = [tenantId, companyId, startDate, endDate, paymentTypeIdsString, clientTypeIdsString, categoryTypeIdsString, accountIdsString, groupTypeIdsString, accountTypeIdsString, reportTypes];

            const [result, _] = await db.execute(sql, params, { nullUndefined: true });
            return result;
        } catch (error) {
            console.error('Error in findAllAccount:', error);
            throw error;
        };
    };

    static async findAllAccount(tenantId, companyId, startDate = null, endDate = null, paymentTypeIds = null, clientTypeIds = null, categoryTypeIds = null, accountIds = null, groupTypeIds = null, accountTypeIds = null, reportTypes = null) {
        try {

            let sql;
            let params;

            const paymentTypeIdsString = Array.isArray(paymentTypeIds) && paymentTypeIds.length > 0 ? paymentTypeIds.join(',') : null;
            const clientTypeIdsString = Array.isArray(clientTypeIds) && clientTypeIds.length > 0 ? clientTypeIds.join(',') : null;
            const categoryTypeIdsString = Array.isArray(categoryTypeIds) && categoryTypeIds.length > 0 ? categoryTypeIds.join(',') : null;
            const accountIdsString = Array.isArray(accountIds) && accountIds.length > 0 ? accountIds.join(',') : null;
            const groupTypeIdsString = Array.isArray(groupTypeIds) && groupTypeIds.length > 0 ? groupTypeIds.join(',') : null;
            const accountTypeIdsString = Array.isArray(accountTypeIds) && accountTypeIds.length > 0 ? accountTypeIds.join(',') : null;
            sql = `CALL report_statement(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            params = [tenantId, companyId, startDate, endDate, paymentTypeIdsString, clientTypeIdsString, categoryTypeIdsString, accountIdsString, groupTypeIdsString, accountTypeIdsString, reportTypes];

            const [result, _] = await db.execute(sql, params, { nullUndefined: true });
            return result;
        } catch (error) {
            console.error('Error in findAllAccount:', error);
            throw error;
        };
    };

    static async findAllGroup(tenantId, companyId, startDate = null, endDate = null, paymentTypeIds = null, clientTypeIds = null, categoryTypeIds = null, accountIds = null, groupTypeIds = null, accountTypeIds = null, reportTypes = null) {
        try {

            let sql;
            let params;

            const paymentTypeIdsString = Array.isArray(paymentTypeIds) && paymentTypeIds.length > 0 ? paymentTypeIds.join(',') : null;
            const clientTypeIdsString = Array.isArray(clientTypeIds) && clientTypeIds.length > 0 ? clientTypeIds.join(',') : null;
            const categoryTypeIdsString = Array.isArray(categoryTypeIds) && categoryTypeIds.length > 0 ? categoryTypeIds.join(',') : null;
            const accountIdsString = Array.isArray(accountIds) && accountIds.length > 0 ? accountIds.join(',') : null;
            const groupTypeIdsString = Array.isArray(groupTypeIds) && groupTypeIds.length > 0 ? groupTypeIds.join(',') : null;
            const accountTypeIdsString = Array.isArray(accountTypeIds) && accountTypeIds.length > 0 ? accountTypeIds.join(',') : null;
            sql = `CALL report_statement(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            params = [tenantId, companyId, startDate, endDate, paymentTypeIdsString, clientTypeIdsString, categoryTypeIdsString, accountIdsString, groupTypeIdsString, accountTypeIdsString, reportTypes];

            const [result, _] = await db.execute(sql, params, { nullUndefined: true });
            return result;
        } catch (error) {
            console.error('Error in findAllAccount:', error);
            throw error;
        };
    };

    static async findAllCompany(tenantId, companyId, startDate = null, endDate = null, clientTypeIds = null, paymentTypeIds = null, categoryTypeIds = null, accountIds = null, groupTypeIds = null, accountTypeIds = null) {
        try {

            const reportTypes = null;

            let sql;
            let params;

            const clientTypeIdsString = Array.isArray(clientTypeIds) && clientTypeIds.length > 0 ? clientTypeIds.join(',') : null;
            const paymentTypeIdsString = Array.isArray(paymentTypeIds) && paymentTypeIds.length > 0 ? paymentTypeIds.join(',') : null;
            const categoryTypeIdsString = Array.isArray(categoryTypeIds) && categoryTypeIds.length > 0 ? categoryTypeIds.join(',') : null;
            const accountIdsString = Array.isArray(accountIds) && accountIds.length > 0 ? accountIds.join(',') : null;
            const groupTypeIdsString = Array.isArray(groupTypeIds) && groupTypeIds.length > 0 ? groupTypeIds.join(',') : null;
            const accountTypeIdsString = Array.isArray(accountTypeIds) && accountTypeIds.length > 0 ? accountTypeIds.join(',') : null;
            sql = `CALL report_statement(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            params = [tenantId, companyId, startDate, endDate, paymentTypeIdsString, clientTypeIdsString, categoryTypeIdsString, accountIdsString, groupTypeIdsString, accountTypeIdsString, reportTypes];

            const [result, _] = await db.execute(sql, params, { nullUndefined: true });
            return result;
        } catch (error) {
            console.error('Error in findAllAccount:', error);
            throw error;
        };
    };

    static async findAllAccountType(tenantId, companyId, startDate = null, endDate = null, clientTypeIds = null, paymentTypeIds = null, categoryTypeIds = null, accountIds = null, groupTypeIds = null, accountTypeIds = null) {
        try {

            const reportTypes = null;

            let sql;
            let params;

            const clientTypeIdsString = Array.isArray(clientTypeIds) && clientTypeIds.length > 0 ? clientTypeIds.join(',') : null;
            const paymentTypeIdsString = Array.isArray(paymentTypeIds) && paymentTypeIds.length > 0 ? paymentTypeIds.join(',') : null;
            const categoryTypeIdsString = Array.isArray(categoryTypeIds) && categoryTypeIds.length > 0 ? categoryTypeIds.join(',') : null;
            const accountIdsString = Array.isArray(accountIds) && accountIds.length > 0 ? accountIds.join(',') : null;
            const groupTypeIdsString = Array.isArray(groupTypeIds) && groupTypeIds.length > 0 ? groupTypeIds.join(',') : null;
            const accountTypeIdsString = Array.isArray(accountTypeIds) && accountTypeIds.length > 0 ? accountTypeIds.join(',') : null;
            sql = `CALL report_statement(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            params = [tenantId, companyId, startDate, endDate, paymentTypeIdsString, clientTypeIdsString, categoryTypeIdsString, accountIdsString, groupTypeIdsString, accountTypeIdsString, reportTypes];

            const [result, _] = await db.execute(sql, params, { nullUndefined: true });
            return result;
        } catch (error) {
            console.error('Error in findAllAccount:', error);
            throw error;
        };
    };
};

module.exports = reports;