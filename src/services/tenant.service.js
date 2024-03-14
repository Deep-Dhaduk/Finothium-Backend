const db = require('../db/dbconnection');
const message = ("This data is in used, you can't delete it.");
const Tenant = require("../models/tenant");

const deleteTenant = async (tenantId) => {
    try {
        const [
            accountResults
        ] = await db.execute(`SELECT COUNT(*) AS count FROM account_master WHERE tenantId = ${tenantId}`);

        if (accountResults[0].count > 0) {
            return { success: false, message: message };
        }

        const [
            clientResults
        ] = await db.execute(`SELECT COUNT(*) AS count FROM client_master WHERE tenantId = ${tenantId}`);

        if (clientResults[0].count > 0) {
            return { success: false, message: message };
        }

        const [
            commonResult
        ] = await db.execute(`SELECT COUNT(*) AS count FROM common_master WHERE tenantId = ${tenantId}`);

        if (commonResult[0].count > 0) {
            return { success: false, message: message };
        }

        const [
            transactionResult
        ] = await db.execute(`SELECT COUNT(*) AS count FROM transaction WHERE tenantId = ${tenantId}`);

        if (transactionResult[0].count > 0) {
            return { success: false, message: message };
        }

        const [
            transferResult
        ] = await db.execute(`SELECT COUNT(*) AS count FROM transfer WHERE tenantId = ${tenantId}`);

        if (transferResult[0].count > 0) {
            return { success: false, message: message };
        };

        await Tenant.delete(tenantId)
        await db.execute('CALL delete_tenant(?)', [tenantId]);
        return { success: true, message: "Tenant deleted successfully!" };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = { deleteTenant };