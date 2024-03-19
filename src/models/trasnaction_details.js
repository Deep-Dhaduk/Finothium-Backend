const db = require('../db/dbconnection')

class TransactionDetails {
            constructor(tenantId, transactionId, name, amount, description, companyId, createdBy, updatedBy) {
        this.tenantId = tenantId;
        this.transactionId = transactionId;
        this.name = name;
        this.amount = amount;
        this.description = description;
        this.companyId = companyId;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
    };

    static async save(details) {
        try {
            let values = details.map(detail => `(
                '${detail.tenantId}',
                '${detail.transactionId}',
                '${detail.name}',
                '${detail.amount}',
                '${detail.description}',
                '${detail.companyId}',
                '${detail.createdBy}',
                UTC_TIMESTAMP(),
                '${detail.updatedBy}',
                UTC_TIMESTAMP()
            )`).join(',');

            let sql = `
            INSERT INTO transaction_details(
                tenantId,
                transactionId,
                name,
                amount,
                description,
                companyId,
                createdBy,
                createdOn,
                updatedBy,
                updatedOn
            )
            VALUES ${values}`;

            return db.execute(sql);
        } catch (error) {
            throw error;
        }
    }

    static getAllTransactioDetails(tenantId) {
        return `
        SELECT id,
        transactionId,
        name,
        amount,
        description,
        companyId,
        createdBy,
        get_datetime_in_server_datetime(createdOn) AS createdOn,
        updatedBy,
        get_datetime_in_server_datetime(updatedOn) AS updatedOn
         FROM transaction_details
         WHERE tenantId='${tenantId}'
        `
    }

    static findAll(tenantId) {
        let sql = this.getAllTransactioDetails(tenantId);
        return db.execute(sql)
    }

    static async findById(tenantId, id) {
        let sql = this.getAllTransactioDetails(tenantId)
        sql += `AND id = ${id}`;
        return await db.execute(sql)
    };
}

module.exports = TransactionDetails;