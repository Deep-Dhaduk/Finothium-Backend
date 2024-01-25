const db = require('../db/dbconnection')

class Transaction {
    constructor(tenantId, transaction_date, transaction_type, payment_type_Id, client_category_name_Id, accountId, amount, description, createdBy, updatedBy) {
        this.tenantId = tenantId;
        this.transaction_date = transaction_date;
        this.transaction_type = transaction_type;
        this.payment_type_Id = payment_type_Id;
        this.client_category_name_Id = client_category_name_Id;
        this.accountId = accountId;
        this.amount = amount;
        this.description = description;
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
            INSERT INTO transaction(
                tenantId,
                transaction_date,
                transaction_type,
                payment_type_Id,
                client_category_name_Id,
                accountId,
                amount,
                description,
                createdBy,
                createdOn,
                updatedBy,
                updatedOn
            )
            VALUES(
                '${this.tenantId}',
                '${this.transaction_date}',
                '${this.transaction_type}',
                '${this.payment_type_Id}',
                '${this.client_category_name_Id}',
                '${this.accountId}',
                '${this.amount}',
                '${this.description}',
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
        let sql = `
            SELECT t.*,
                   cp.name as payment_type_name,
                   cc.name as client_category_name,
                   a.account_name as account_name
            FROM transaction t
            LEFT JOIN common_master cp ON t.payment_type_Id = cp.common_id
            LEFT JOIN common_master cc ON t.client_category_name_Id = cc.common_id
            LEFT JOIN account_master a ON t.accountId = a.account_id
        `;
        if (tenantId) {
            sql += ` WHERE t.tenantId = '${tenantId}'`;
        }
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
        let sql = `UPDATE transaction SET tenantId='${this.tenantId}', transaction_date='${this.transaction_date}', transaction_type='${this.transaction_type}', payment_type_Id='${this.payment_type_Id}', client_category_name_Id='${this.client_category_name_Id}', accountId='${this.accountId}', amount='${this.amount}', description='${this.description}', createdBy='${this.createdBy}',updatedBy='${this.updatedBy}', updatedOn='${this.dateandtime()}' WHERE transactionId = ${id}`;
        return db.execute(sql);
    }
}

module.exports = Transaction;