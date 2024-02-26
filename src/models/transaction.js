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

    static async findAll(tenantId, companyId, startDate = null, endDate = null, type = null, paymentTypeIds = null, clientTypeIds = null, categoryTypeIds = null, accountIds = null, groupTypeIds = null, accountTypeIds = null, limit = null) {
        try {
            let sql;
            let params;

            const paymentTypeIdsString = Array.isArray(paymentTypeIds) && paymentTypeIds.length > 0 ? paymentTypeIds.join(',') : null;
            const clientTypeIdsString = Array.isArray(clientTypeIds) && clientTypeIds.length > 0 ? clientTypeIds.join(',') : null;
            const categoryTypeIdsString = Array.isArray(categoryTypeIds) && categoryTypeIds.length > 0 ? categoryTypeIds.join(',') : null;
            const accountIdsString = Array.isArray(accountIds) && accountIds.length > 0 ? accountIds.join(',') : null;
            const groupTypeIdsString = Array.isArray(groupTypeIds) && groupTypeIds.length > 0 ? groupTypeIds.join(',') : null;
            const accountTypeIdsString = Array.isArray(accountTypeIds) && accountTypeIds.length > 0 ? accountTypeIds.join(',') : null;
            sql = `CALL transaction(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            params = [tenantId, companyId, startDate, endDate, type, paymentTypeIdsString, clientTypeIdsString, categoryTypeIdsString, accountIdsString, groupTypeIdsString, accountTypeIdsString, limit || 95];

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