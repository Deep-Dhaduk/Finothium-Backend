const db = require('../db/dbconnection')

class reports {
    constructor(tenantId, company_wise_statement, group_wise_statement, account_wise_statement, payment_type_wise_statement, client_wise_statement, category_wise_statement, createdBy, updatedBy) {
        this.tenantId = tenantId;
        this.company_wise_statement = company_wise_statement;
        this.group_wise_statement = group_wise_statement;
        this.account_wise_statement = account_wise_statement;
        this.payment_type_wise_statement = payment_type_wise_statement;
        this.client_wise_statement = client_wise_statement;
        this.category_wise_statement = category_wise_statement;
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
    };

    async save() {

        try {
            let sql = `
            INSERT INTO reports(
                tenantId,
                company_wise_statement,
                group_wise_statement,
                account_wise_statement,
                payment_type_wise_statement,
                client_wise_statement,
                category_wise_statement,
                createdBy,
                createdOn,
                updatedOn
            )
            VALUES(
                '${this.tenantId}',
                '${this.company_wise_statement}',
                '${this.group_wise_statement}',
                '${this.account_wise_statement}',
                '${this.payment_type_wise_statement}',
                '${this.client_wise_statement}',
                '${this.category_wise_statement}',
                '${this.createdBy}',
                '${this.dateandtime()}',
                '${this.dateandtime()}'
            )`;
            return db.execute(sql)

        } catch (error) {
            throw error;
        }
    };

    static findAll(tenantId) {
        let sql = "SELECT * FROM reports";
        if (tenantId) {
            sql += ` WHERE tenantId = '${tenantId}'`;
        }
        return db.execute(sql)
    }
    static findById(id) {
        let sql = `SELECT * FROM reports WHERE report_id = ${id}`;
        return db.execute(sql)
    }
    static delete(id) {
        let sql = `DELETE FROM reports WHERE report_id = ${id}`;
        return db.execute(sql)
    }

    async update(id) {
        let sql = `UPDATE reports SET tenantId='${this.tenantId}',company_wise_statement='${this.company_wise_statement}',group_wise_statement='${this.group_wise_statement}',account_wise_statement='${this.account_wise_statement}',payment_type_wise_statement='${this.payment_type_wise_statement}',client_wise_statement='${this.client_wise_statement}',category_wise_statement='${this.category_wise_statement}',updatedBy='${this.updatedBy}',updatedOn='${this.dateandtime()}' WHERE report_id = ${id}`;
        return db.execute(sql)

    };
}

module.exports = reports;