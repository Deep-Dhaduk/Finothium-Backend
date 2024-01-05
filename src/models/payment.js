const db = require('../db/dbconnection')

class Payment {
    constructor(tenantId, transaction_date, transaction_type, payment_type, client_category_name, accountId, amount, description, createdBy, updatedBy) {
        this.tenantId = tenantId;
        this.transaction_date = transaction_date;
        this.transaction_type = transaction_type;
        this.payment_type = payment_type;
        this.client_category_name = client_category_name;
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

        const transaction_date = this.formatDate(this.transaction_date);

        try {
            let sql = `
            INSERT INTO payment_transaction(
                tenantId,
                transaction_date,
                transaction_type,
                payment_type,
                client_category_name,
                accountId,
                amount,
                description,
                createdBy,
                createdOn,
                updatedOn
            )
            VALUES(
                '${this.tenantId}',
                '${transaction_date}',
                '${this.transaction_type}',
                '${this.payment_type}',
                '${this.client_category_name}',
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

    formatDate(dateString) {
        const [dd, mm, yyyy] = dateString.split('-');
        return `${yyyy}-${mm}-${dd}`;
    }

    static findAll(tenantId) {
        let sql = "SELECT * FROM payment_transaction";
        if (tenantId) {
            sql += ` WHERE tenantId = '${tenantId}'`;
        }
        return db.execute(sql)
    }
    static findById(id) {
        let sql = `SELECT * FROM payment_transaction WHERE transaction_id = ${id}`;
        return db.execute(sql)
    }
    static delete(id) {
        let sql = `DELETE FROM payment_transaction WHERE transaction_id = ${id}`;
        return db.execute(sql)
    }

    async update(id) {
        let sql = `UPDATE payment_transaction SET tenantId='${this.tenantId}',transaction_date='${this.transaction_date}',transaction_type='${this.transaction_type}',payment_type='${this.payment_type}',client_category_name='${this.client_category_name}',accountId='${this.accountId}',amount='${this.amount}',description='${this.description}',updatedBy='${this.updatedBy}',updatedOn='${this.dateandtime()}' WHERE transaction_id = ${id}`;
        return db.execute(sql)

    };
}

module.exports = Payment;