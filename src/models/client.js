const db = require('../db/dbconnection')

class Client {
    constructor(tenantId, clientName, status, createdBy, updatedBy, companyId, type) {
        this.tenantId = tenantId;
        this.clientName = clientName;
        this.status = status;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.companyId = companyId;
        this.type = type;
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
            INSERT INTO client_master(
                tenantId,
                clientName,
                status,
                createdBy,
                createdOn,
                updatedBy,
                updatedOn,
                companyId,
                type
            )
            VALUES(
                '${this.tenantId}',
                '${this.clientName}',
                '${this.status}',
                '${this.createdBy}',
                '${this.dateandtime()}',
                '${this.updatedBy}',
                '${this.dateandtime()}',
                '${this.companyId}',
                '${this.type}'
            )`;
            return db.execute(sql)

        } catch (error) {
            throw error;
        }
    };

    static getAllClientDetails(tenantId, companyId, type) {
        let whereClause = "";

        if (tenantId) {
            whereClause += ` WHERE tenantId = '${tenantId}'`;
        }
        if (companyId) {
            if (whereClause !== "") {
                whereClause += ` AND companyId = '${companyId}'`;
            } else {
                whereClause += ` WHERE companyId = '${companyId}'`;
            }
        } if (type) {
            if (whereClause !== "") {
                whereClause += ` AND type = '${type}'`;
            } else {
                whereClause += ` WHERE type = '${type}'`;
            }
        }

        const sql = `SELECT *, DATE_SUB(createdOn, INTERVAL 5 HOUR) AS adjusted_createdOn, DATE_SUB(updatedOn, INTERVAL 5 HOUR) AS adjusted_updatedOn FROM client_master${whereClause}`;

        return sql;
    };

    static findAll(tenantId, companyId, type) {
        let sql = this.getAllClientDetails(tenantId, companyId, type)
        sql += " ORDER BY clientName ASC";
        return db.execute(sql);
    };

    static findActiveAll(tenantId, companyId, type) {
        let sql = this.getAllClientDetails(tenantId, companyId, type)
        sql += " AND status = 1"
        sql += " ORDER BY clientName ASC";
        return db.execute(sql);
    };

    static findById(tenantId, companyId, id) {
        let sql = this.getAllClientDetails(tenantId, companyId)
        sql += `AND clientId= ${id}`;
        return db.execute(sql)
    };

    static delete(tenantId, companyId, id) {
        let sql = `DELETE FROM client_master WHERE tenantId = ${tenantId} AND companyId = ${companyId} AND clientId = ${id}`;
        return db.execute(sql)
    };

    async update(tenantId, companyId, id) {
        let sql = `UPDATE client_master SET clientName='${this.clientName}',status='${this.status}',updatedBy='${this.updatedBy}',updatedOn='${this.dateandtime()}',companyId='${this.companyId}',type='${this.type}' WHERE tenantId = ${tenantId} AND companyId = ${companyId} AND clientId = ${id}`;
        return db.execute(sql)

    };
}

module.exports = Client;