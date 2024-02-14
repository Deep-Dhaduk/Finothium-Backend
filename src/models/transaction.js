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

    static async findAll(tenantId, companyId, startDate = null, endDate = null, type = null, paymentTypeIds = null, clientTypeIds = null, accountTypeIds = null) {
        try {
            let sql;
            let params;

            if (startDate && endDate && type) {
                sql = `CALL transaction(?, ?, ?, ?, ?, ?, ?, ?)`;
                params = [tenantId, companyId, startDate, endDate, type, paymentTypeIds || null, clientTypeIds || null, accountTypeIds || null];
            } else if (startDate && endDate && type && !paymentTypeIds && !clientTypeIds && !accountTypeIds) {
                sql = "CALL transaction(?, ?, ?, ?, ?, NULL, NULL, NULL)";
                params = [tenantId, companyId, startDate, endDate, type, null, null, null];
            } else {
                sql = "CALL transaction(?, ?, ?, ?, NULL, NULL, NULL, NULL)";
                params = [tenantId, companyId, null, null, type, null, null, null];
            }

            const [result, _] = await db.execute(sql, params, { nullUndefined: true });
            return result;
        } catch (error) {
            console.error('Error in findAll:', error);
            throw error;
        }
    }

    static findById(id) {
        let sql = `SELECT * FROM transaction WHERE transactionId = ${id}`;
        return db.execute(sql)
    };

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