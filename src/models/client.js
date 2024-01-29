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

    static findAll(tenantId) {
        let sql = "SELECT * FROM client_master";
        if (tenantId) {
            sql += ` WHERE tenantId = '${tenantId}'`;
        }
        return db.execute(sql)
    }
    static findById(id) {
        let sql = `SELECT * FROM client_master WHERE clientId = ${id}`;
        return db.execute(sql)
    }
    static delete(id) {
        let sql = `DELETE FROM client_master WHERE clientId = ${id}`;
        return db.execute(sql)
    }

    async update(id) {
        let sql = `UPDATE client_master SET tenantId='${this.tenantId}',clientName='${this.clientName}',status='${this.status}',createdBy='${this.createdBy}',updatedBy='${this.updatedBy}',updatedOn='${this.dateandtime()}',type='${this.type}' WHERE clientId = ${id}`;
        return db.execute(sql)

    };
}

module.exports = Client;