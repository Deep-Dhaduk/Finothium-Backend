const db = require('../db/dbconnection')

class Account {
    constructor(tenantId, account_name, group_name_Id, join_date, exit_date, account_type_Id, status, createdBy, updatedBy, companyId) {
        this.tenantId = tenantId;
        this.account_name = account_name;
        this.group_name_Id = group_name_Id;
        this.join_date = join_date;
        this.exit_date = exit_date;
        this.account_type_Id = account_type_Id;
        this.status = status;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.companyId = companyId;
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
            INSERT INTO account_master(
                tenantId,
                account_name,
                group_name_Id,
                join_date,
                exit_date,
                account_type_Id,
                status,
                createdBy,
                createdOn,
                updatedBy,
                updatedOn,
                companyId
            )
            VALUES(
                '${this.tenantId}',
                '${this.account_name}',
                '${this.group_name_Id}',
                '${this.join_date}',
                '${this.exit_date}',
                '${this.account_type_Id}',
                '${this.status}',
                '${this.createdBy}',
                '${this.dateandtime()}',
                '${this.updatedBy}',
                '${this.dateandtime()}',
                '${this.companyId}'
            )`;
            return db.execute(sql)

        } catch (error) {
            throw error;
        }
    }

    static findAll(tenantId, companyId) {
        let sql = `
        SELECT a.*, c.name AS group_name, ct.name AS account_type_name,
        DATE_SUB(a.createdOn, INTERVAL 5 HOUR) AS adjusted_createdOn,
        DATE_SUB(a.updatedOn, INTERVAL 5 HOUR) AS adjusted_updatedOn
        FROM account_master a
        LEFT JOIN common_master c ON a.group_name_Id = c.common_id
        LEFT JOIN common_master ct ON a.account_type_Id = ct.common_id
        `;
        if (tenantId && companyId) {
            sql += ` WHERE a.tenantId = '${tenantId}' AND companyId = '${companyId}'`;
        } else if (tenantId) {
            sql += ` WHERE a.tenantId = '${tenantId}'`;
        } else if (companyId) {
            sql += ` WHERE companyId = '${companyId}'`;
        }
        sql += " ORDER BY group_name, a.account_name";
        return db.execute(sql);
    };

    static findActiveAll(tenantId, companyId) {
        let sql = `
        SELECT a.*, c.name AS group_name, ct.name AS account_type_name,
        DATE_SUB(a.createdOn, INTERVAL 5 HOUR) AS adjusted_createdOn,
        DATE_SUB(a.updatedOn, INTERVAL 5 HOUR) AS adjusted_updatedOn
        FROM account_master a
        LEFT JOIN common_master c ON a.group_name_Id = c.common_id
        LEFT JOIN common_master ct ON a.account_type_Id = ct.common_id
        WHERE a.status = 1
        `;
        if (tenantId) {
            sql += ` AND a.tenantId = '${tenantId}'`;
        }
        if (companyId) {
            sql += ` AND a.companyId = '${companyId}'`;
        }
        sql += " ORDER BY a.account_name";
        return db.execute(sql);
    };

    static findById(id) {
        let sql = `
            SELECT *
            FROM account_master
            WHERE account_id = ${id}
        `;
        return db.execute(sql);
    }

    static findByAccountId(id) {
        let sql = `
            SELECT *
            FROM account_master
            WHERE account_id = ${id.accountId}
        `;
        return db.execute(sql);
    };

    static delete(accountId) {
        let sql = `DELETE FROM account_master WHERE account_id = ${accountId}`;
        return db.execute(sql)
    };

    async update(id) {
        let sql = `UPDATE account_master SET tenantId='${this.tenantId}',account_name='${this.account_name}',group_name_Id='${this.group_name_Id}',join_date='${this.join_date}',exit_date='${this.exit_date}',account_type_Id='${this.account_type_Id}',status='${this.status}',createdBy='${this.createdBy}',updatedBy='${this.updatedBy}',updatedOn='${this.dateandtime()}' WHERE account_id = ${id}`;
        return db.execute(sql)
    };
}

module.exports = Account;