const db = require('../db/dbconnection')

class Role {
    constructor(tenantId, rolename, status, createdBy, updatedBy) {
        this.tenantId = tenantId;
        this.rolename = rolename;
        this.status = status;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
    }

    dateandtime = () => {

        let d = new Date();
        let yyyy = d.getFullYear();
        let mm = d.getMonth() + 1;
        let dd = d.getDate();
        let hours = d.getUTCHours();
        let minutes = d.getUTCMinutes();
        let seconds = d.getUTCSeconds();

        return `${yyyy}-${mm}-${dd}` + " " + `${hours}:${minutes}:${seconds}`;
    }

    async save() {
        try {
            let sql = `
        INSERT INTO role_master(
            tenantId,
            rolename,
            status,
            createdBy,
            createdOn,
            updatedBy,
            updatedOn
        )
        VALUES(
            '${this.tenantId}',
            '${this.rolename}',
            '${this.status}',
            '${this.createdBy}',
            '${this.dateandtime()}',
            '${this.updatedBy}',
            '${this.dateandtime()}'
        )`;
            return db.execute(sql)

        } catch (error) {
            throw error;
        }
    }

    static findAll(tenantId) {
        let sql = "SELECT *, DATE_SUB(createdOn, INTERVAL 5 HOUR) AS adjusted_createdOn, DATE_SUB(updatedOn, INTERVAL 5 HOUR) AS adjusted_updatedOn FROM role_master";
        if (tenantId) {
            sql += ` WHERE tenantId = '${tenantId}'`;
        }
        sql += `  ORDER BY rolename ASC;`;
        return db.execute(sql)
    }

    static findActiveAll(tenantId) {
        let sql = "SELECT *, DATE_SUB(createdOn, INTERVAL 5 HOUR) AS adjusted_createdOn, DATE_SUB(updatedOn, INTERVAL 5 HOUR) AS adjusted_updatedOn FROM role_master WHERE status = 1";
        if (tenantId) {
            sql += ` AND tenantId = '${tenantId}'`;
        }
        return db.execute(sql)
    }

    static async findById(tenantId, id) {
        let sql = `SELECT *, DATE_SUB(createdOn, INTERVAL 5 HOUR) AS adjusted_createdOn, DATE_SUB(updatedOn, INTERVAL 5 HOUR) AS adjusted_updatedOn FROM role_master WHERE tenantId = ${tenantId} AND id = ${id}`;
        return await db.execute(sql)
    }

    static delete(tenantId, roleId) {
        let sql = `DELETE FROM role_master WHERE tenantId = ${tenantId} AND id = ${roleId}`;
        return db.execute(sql)
    };

    async update(tenantId, id) {
        let sql = `UPDATE role_master SET rolename='${this.rolename}',status='${this.status}',updatedBy='${this.updatedBy}',updatedOn='${this.dateandtime()}' WHERE tenantId = ${tenantId} AND id = ${id}`;
        return db.execute(sql)

    };
}

module.exports = Role;