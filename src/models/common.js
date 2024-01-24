const db = require('../db/dbconnection')

class Common {
    constructor(tenantId, name, type, status, createdBy, updatedBy) {
        this.tenantId = tenantId;
        this.name = name;
        this.type = type;
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
            INSERT INTO common_master(
                tenantId,
                name,
                type,
                status,
                createdBy,
                createdOn,
                updatedBy,
                updatedOn
            )
            VALUES(
                '${this.tenantId}',
                '${this.name}',
                '${this.type}',
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
    };

    static findAll(tenantId) {
        let sql = "SELECT * FROM common_master";
        if (tenantId) {
            sql += ` WHERE tenantId = '${tenantId}'`;
        }
        return db.execute(sql)
    }
    static findById(id) {
        let sql = `SELECT * FROM common_master WHERE common_id = ${id}`;
        return db.execute(sql)
    }
    static delete(id) {
        let sql = `DELETE FROM common_master WHERE common_id = ${id}`;
        return db.execute(sql)
    }

    async update(id) {
        let sql = `UPDATE common_master SET tenantId='${this.tenantId}',name='${this.name}',type='${this.type}',status='${this.status}',updatedBy='${this.updatedBy}',updatedOn='${this.dateandtime()}' WHERE common_id = ${id}`;
        return db.execute(sql)

    };
}

module.exports = Common;