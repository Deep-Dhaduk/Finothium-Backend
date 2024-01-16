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
                '${this.dateandtime()}'
            )`;
            return db.execute(sql)

        } catch (error) {
            throw error;
        }
    };

    static findAll(tenantId) {
        let sql = "SELECT * FROM transaction";
        if (tenantId) {
            sql += ` WHERE tenantId = '${tenantId}'`;
        }
        return db.execute(sql)
    }
    static findById(id) {
        let sql = `SELECT * FROM transaction WHERE transaction_id = ${id}`;
        return db.execute(sql)
    }
    static delete(id) {
        let sql = `DELETE FROM transaction WHERE transaction_id = ${id}`;
        return db.execute(sql)
    }

    async update(id) {
        let sql = `UPDATE transaction SET tenantId='${this.tenantId}',transaction_date='${this.transaction_date}',transaction_type='${this.transaction_type}',payment_type_Id='${this.payment_type_Id}',client_category_name_Id='${this.client_category_name_Id}',accountId='${this.accountId}',amount='${this.amount}',description='${this.description}',updatedBy='${this.updatedBy}',updatedOn='${this.dateandtime()}' WHERE transaction_id = ${id}`;
        return db.execute(sql)

    };
}

module.exports = Transaction;