const db = require('../db/dbconnection');

class Dashboard {
    static async calculateDashboardAmounts(tenantId) {
        try {
            let sql = "CALL calculate_dashboard_amounts(?)";
            const [result, _] = await db.execute(sql, [tenantId]);
            return result;
        } catch (error) {
            console.error('Error in findAll:', error);
            throw error;
        };
    };
}


module.exports = Dashboard;
