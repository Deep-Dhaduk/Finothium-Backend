const db = require('../db/dbconnection');

class reports {
    static async findAllPayment(tenantId) {
        try {
            let sql = "CALL payment_wise_statement(?)";
            const [result, _] = await db.execute(sql, [tenantId]);
            return result;
        } catch (error) {
            console.error('Error in findAll:', error);
            throw error;
        };
    };
};

module.exports = reports;
