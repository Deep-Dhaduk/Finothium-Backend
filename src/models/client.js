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

    static findAll(tenantId, type, id) {
        let sql = "SELECT *, DATE_SUB(createdOn, INTERVAL 5 HOUR) AS adjusted_createdOn, DATE_SUB(updatedOn, INTERVAL 5 HOUR) AS adjusted_updatedOn FROM client_master";
        let whereClause = "";

        if (tenantId) {
            whereClause += ` WHERE tenantId = '${tenantId}'`;
        }
        if (type) {
            if (whereClause !== "") {
                whereClause += ` AND type = '${type}'`;
            } else {
                whereClause += ` WHERE type = '${type}'`;
            }
        }
        if (id) {
            if (whereClause !== "") {
                whereClause += ` AND companyId = '${id}'`;
            } else {
                whereClause += ` WHERE companyId = '${id}'`;
            }
        }

        sql += whereClause + " ORDER BY clientName ASC";
        return db.execute(sql);
    };



    static findBycompanyId(id) {
        let sql = `
        SELECT * FROM client_master
            WHERE companyId = ${id}
        `;;
        return db.execute(sql);
    }

    static findById(id) {
        let sql = `SELECT * FROM client_master WHERE clientId = ${id}`;
        return db.execute(sql)
    };

    static delete(id) {
        let sql = `DELETE FROM client_master WHERE clientId = ${id}`;
        return db.execute(sql)
    };

    async update(id) {
        let sql = `UPDATE client_master SET tenantId='${this.tenantId}',clientName='${this.clientName}',status='${this.status}',createdBy='${this.createdBy}',updatedBy='${this.updatedBy}',updatedOn='${this.dateandtime()}',companyId='${this.companyId}',type='${this.type}' WHERE clientId = ${id}`;
        return db.execute(sql)

    };
}

module.exports = Client;