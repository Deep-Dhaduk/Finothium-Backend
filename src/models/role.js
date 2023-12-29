const db = require('../db/dbconnection')

class Role {
    constructor(tenantId, rolename, status, createdBy) {
        this.tenantId = tenantId;
        this.rolename = rolename;
        this.status = status;
        this.createdBy = createdBy;
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
            updatedOn
        )
        VALUES(
            '${this.tenantId}',
            '${this.rolename}',
            '${this.status}',
            '${this.createdBy}',
            '${this.dateandtime()}',
            '${this.dateandtime()}'
        )`;
            return db.execute(sql)

        } catch (error) {
            throw error;
        }
    }

    static findAll() {
        let sql = "SELECT * FROM role_master";
        return db.execute(sql)
    }
    static findById(id) {
        let sql = `SELECT * FROM role_master WHERE id = ${id}`;
        return db.execute(sql)
    }
    static delete(id) {
        let sql = `DELETE FROM role_master WHERE id = ${id}`;
        return db.execute(sql)
    }

    async update(id) {
        let sql = `UPDATE role_master SET tenantId='${this.tenantId}',rolename='${this.rolename}',status='${this.status}',updatedOn='${this.dateandtime()}' WHERE id = ${id}`;
        return db.execute(sql)

    };
}

module.exports = Role;