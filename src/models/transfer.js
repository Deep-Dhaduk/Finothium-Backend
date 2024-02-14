const db = require('../db/dbconnection')

class Transfer {
    constructor(tenantId, transactionDate, paymentType_Id, fromAccount, toAccount, amount, description, createdBy, updatedBy, companyId) {
        this.tenantId = tenantId;
        this.transactionDate = transactionDate;
        this.paymentType_Id = paymentType_Id;
        this.fromAccount = fromAccount;
        this.toAccount = toAccount;
        this.amount = amount;
        this.description = description;
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
            INSERT INTO transfer(
                tenantId,
                transactionDate,
                paymentType_Id,
                fromAccount,
                toAccount,
                amount,
                description,
                createdBy,
                createdOn,
                updatedBy,
                updatedOn,
                companyId
            )
            VALUES(
                '${this.tenantId}',
                '${this.transactionDate}',
                '${this.paymentType_Id}',
                '${this.fromAccount}',
                '${this.toAccount}',
                '${this.amount}',
                '${this.description}',
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
    };

    static async findAll(tenantId, companyId, startDate = null, endDate = null, paymentTypeIds = null, accountTypeIds = null) {
        try {
            let sql;
            let params;

            if (startDate !== null && endDate !== null && paymentTypeIds !== null && accountTypeIds !== null && Array.isArray(paymentTypeIds) && Array.isArray(accountTypeIds) && paymentTypeIds.length > 0 && accountTypeIds.length > 0) {
                const paymentTypeIdsString = paymentTypeIds.join(',');
                const accountTypeIdsString = accountTypeIds.join(',');

                sql = `CALL transfer(?, ?, ?, ?, ?, ?)`;
                params = [tenantId, companyId, startDate, endDate, paymentTypeIdsString, accountTypeIdsString];
            } else if (startDate !== null && endDate !== null) {
                sql = "CALL transfer(?, ?, ?, ?, ?, ?)";
                params = [tenantId, companyId, startDate, endDate, null, null];
            } else {
                sql = "CALL transfer(?, ?, ?, ?, ?, ?)";
                params = [tenantId, companyId, null, null, null, null];
            }

            const [result, _] = await db.execute(sql, params, { nullUndefined: true });
            return result;
        } catch (error) {
            console.error('Error in findAllAccount:', error);
            throw error;
        };
    };

    static findById(id) {
        let sql = `SELECT * FROM transfer WHERE transfer_id = ${id}`;
        return db.execute(sql)
    }
    static delete(id) {
        let sql = `DELETE FROM transfer WHERE transfer_id = ${id}`;
        return db.execute(sql)
    }

    async update(id) {
        let sql = `UPDATE transfer SET tenantId='${this.tenantId}',transactionDate='${this.transactionDate}',paymentType_Id='${this.paymentType_Id}',fromAccount='${this.fromAccount}',toAccount='${this.toAccount}',amount='${this.amount}',description='${this.description}',createdBy='${this.createdBy}',updatedBy='${this.updatedBy}',updatedOn='${this.dateandtime()}' WHERE transfer_id = ${id}`;
        return db.execute(sql)

    };
}

module.exports = Transfer;