const db = require('../db/dbconnection')

class Transaction {
    constructor(tenantId, transaction_date, transaction_type, payment_type_Id, accountId, amount, description, createdBy, updatedBy, companyId, clientId) {
        this.tenantId = tenantId;
        this.transaction_date = transaction_date;
        this.transaction_type = transaction_type;
        this.payment_type_Id = payment_type_Id;
        this.accountId = accountId;
        this.amount = amount;
        this.description = description;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.companyId = companyId;
        this.clientId = clientId;
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
            INSERT INTO transaction(
                tenantId,
                transaction_date,
                transaction_type,
                payment_type_Id,
                accountId,
                amount,
                description,
                createdBy,
                createdOn,
                updatedBy,
                updatedOn,
                companyId,
                clientId
            )
            VALUES(
                '${this.tenantId}',
                '${this.transaction_date}',
                '${this.transaction_type}',
                '${this.payment_type_Id}',
                '${this.accountId}',
                '${this.amount}',
                '${this.description}',
                '${this.createdBy}',
                '${this.dateandtime()}',
                '${this.updatedBy}',
                '${this.dateandtime()}',
                '${this.companyId}',
                '${this.clientId}'
            )`;
            return db.execute(sql);
        } catch (error) {
            throw error;
        }
    }

    static findAll(tenantId, type) {
        let sql = `
            SELECT t.*,
                   cp.name as payment_type_name,
                   a.account_name as account_name,
                   cn.clientName as client_name
            FROM transaction t
            LEFT JOIN common_master cp ON t.payment_type_Id = cp.common_id
            LEFT JOIN account_master a ON t.accountId = a.account_id
            LEFT JOIN client_master cn ON t.clientId = cn.clientId
        `;
        if (tenantId) {
            sql += ` WHERE t.tenantId = '${tenantId}'`;
        }
        if (type) {
            if (tenantId) {
                sql += ` AND transaction_type = '${type}'`;
            } else {
                sql += ` WHERE transaction_type = '${type}'`;
            }
        }
        sql += " ORDER BY transaction_date DESC";
        return db.execute(sql);
    };

    static findById(id) {
        let sql = `SELECT * FROM transaction WHERE transactionId = ${id}`;
        return db.execute(sql)
    }
    static delete(id) {
        let sql = `DELETE FROM transaction WHERE transactionId = ${id}`;
        return db.execute(sql)
    }

    async update(id) {
        let sql = `UPDATE transaction SET tenantId='${this.tenantId}', transaction_date='${this.transaction_date}', transaction_type='${this.transaction_type}', payment_type_Id='${this.payment_type_Id}',accountId='${this.accountId}', amount='${this.amount}', description='${this.description}', createdBy='${this.createdBy}',updatedBy='${this.updatedBy}', updatedOn='${this.dateandtime()}', clientId='${this.clientId}' WHERE transactionId = ${id}`;
        return db.execute(sql);
    }
}

module.exports = Transaction;