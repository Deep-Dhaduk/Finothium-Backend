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
        return db.execute(sql)
    }

    static findById(id) {
        let sql = `SELECT * FROM role_master WHERE id = ${id}`;
        return db.execute(sql)
    }

    static async delete(roleId) {
        try {
            const [roleResults] = await db.execute(`SELECT COUNT(*) AS count FROM user_master WHERE roleId = ${roleId}`);

            if (roleResults[0].count > 0) {
                return { success: false, message: 'Cannot delete role record. It is being used in the user_master table.' };
            }

            const [deleteResults] = await db.execute(`DELETE FROM role_master WHERE id = ${roleId}`);

            if (deleteResults.affectedRows > 0) {
                return { success: true, message: 'role record deleted successfully.' };
            } else {
                return { success: false, message: 'Failed to delete role record.' };
            }
        } catch (error) {
            throw error;
        }
    }

    async update(id) {
        let sql = `UPDATE role_master SET tenantId='${this.tenantId}',rolename='${this.rolename}',status='${this.status}',createdBy='${this.createdBy}',updatedBy='${this.updatedBy}',updatedOn='${this.dateandtime()}' WHERE id = ${id}`;
        return db.execute(sql)

    };
}

module.exports = Role;