const db = require('../db/dbconnection')

class Dashboard {

    static findAll(tenantId) {
        let sql = "SELECT * FROM dashboard";
        if (tenantId) {
            sql += ` WHERE tenantId = '${tenantId}'`;
        }
        return db.execute(sql)
    };
}

module.exports = Dashboard;