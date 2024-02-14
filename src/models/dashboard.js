const db = require('../db/dbconnection');

class Dashboard {
    static async calculateDashboardAmounts(tenantId, companyId) {
        try {
            let sql = "CALL calculate_dashboard_amounts(?, ?)";
            const [result, _] = await db.execute(sql, [tenantId, companyId]);
            return result;
        } catch (error) {
            console.error('Error in calculateDashboardAmounts:', error);
            throw error;
        };
    };

    static async getDashboardAccountData(tenantId, companyId) {
        try {
            let sql = "CALL dashboard_account(?, ?)";
            const [result, _] = await db.execute(sql, [tenantId, companyId]);
            return result;
        } catch (error) {
            console.error('Error in getDashboardAccountData:', error);
            throw error;
        };
    };

    static async getDashboardGroupData(tenantId, companyId) {
        try {
            let sql = "CALL dashboard_group(?, ?)";
            const [result, _] = await db.execute(sql, [tenantId, companyId]);
            return result;
        } catch (error) {
            console.error('Error in getDashboardGroupData:', error);
            throw error;
        };
    };
};

module.exports = Dashboard;
