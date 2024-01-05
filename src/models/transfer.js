const db = require('../db/dbconnection')

class Transfer {
    constructor(tenantId, transactionDate, paymentType, fromAccount, toAccount, amount, description, createdBy, updatedBy) {
        this.tenantId = tenantId;
        this.transactionDate = transactionDate;
        this.paymentType = paymentType;
        this.fromAccount = fromAccount;
        this.toAccount = toAccount;
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

        const transactionDate = this.formatDate(this.transactionDate);

        try {
            let sql = `
            INSERT INTO transfer(
                tenantId,
                transactionDate,
                paymentType,
                fromAccount,
                toAccount,
                amount,
                description,
                createdBy,
                createdOn,
                updatedOn
            )
            VALUES(
                '${this.tenantId}',
                '${transactionDate}',
                '${this.paymentType}',
                '${this.fromAccount}',
                '${this.toAccount}',
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
        let sql = "SELECT * FROM transfer";
        if (tenantId) {
            sql += ` WHERE tenantId = '${tenantId}'`;
        }
        return db.execute(sql)
    }
    static findById(id) {
        let sql = `SELECT * FROM transfer WHERE transfer_id = ${id}`;
        return db.execute(sql)
    }
    static delete(id) {
        let sql = `DELETE FROM transfer WHERE transfer_id = ${id}`;
        return db.execute(sql)
    }

    async update(id) {
        let sql = `UPDATE transfer SET tenantId='${this.tenantId}',transactionDate='${this.transactionDate}',paymentType='${this.paymentType}',fromAccount='${this.fromAccount}',toAccount='${this.toAccount}',amount='${this.amount}',description='${this.description}',updatedBy='${this.updatedBy}',updatedOn='${this.dateandtime()}' WHERE transfer_id = ${id}`;
        return db.execute(sql)

    };
}

module.exports = Transfer;