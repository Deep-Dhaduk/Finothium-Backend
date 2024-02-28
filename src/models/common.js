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

    static getAllMasters(tenantId, type) {
        let sql = "SELECT *, DATE_SUB(createdOn, INTERVAL 5 HOUR) AS adjusted_createdOn, DATE_SUB(updatedOn, INTERVAL 5 HOUR) AS adjusted_updatedOn FROM common_master";
        if (tenantId) {
            sql += ` WHERE tenantId = '${tenantId}'`;
        }
        if (type) {
            if (tenantId) {
                sql += ` AND type = '${type}'`;
            } else {
                sql += ` WHERE type = '${type}'`;
            }
        }
        return sql
    }

    static findAll(tenantId, type) {
        let sql = this.getAllMasters(tenantId, type);
        sql += " ORDER BY name";
        return db.execute(sql)
    };

    static findActiveAll(tenantId, type) {
        let sql = this.getAllMasters(tenantId, type);
        sql += " ORDER BY name";
        return db.execute(sql);
    };

    static findById(tenantId, id) {
        let sql = this.getAllMasters(tenantId);
        sql += `AND common_id = ${id}`
        return db.execute(sql)
    };

    static delete(tenantId, commonId) {
        let sql = `DELETE FROM common_master WHERE tenantId = ${tenantId} AND common_id = ${commonId}`;
        return db.execute(sql)
    };

    async update(tenantId, id) {
        let sql = `UPDATE common_master SET name='${this.name}',type='${this.type}',status='${this.status}', updatedBy='${this.updatedBy}',updatedOn='${this.dateandtime()}' WHERE tenantId = ${tenantId} AND common_id = ${id}`;
        return db.execute(sql)

    };
}

module.exports = Common;