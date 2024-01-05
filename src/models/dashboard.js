const db = require('../db/dbconnection')

class Dashboard {
    constructor(tenantId, totalReceive, totalPaid, balance, groupwiseReceive, groupwisePaid, groupwiseBalance, accountwiseReceive, accountwisePaid, accountwiseBalance, createdBy, updatedBy) {
        this.tenantId = tenantId;
        this.totalReceive = totalReceive;
        this.totalPaid = totalPaid;
        this.balance = balance;
        this.groupwiseReceive = groupwiseReceive;
        this.groupwisePaid = groupwisePaid;
        this.groupwiseBalance = groupwiseBalance;
        this.accountwiseReceive = accountwiseReceive;
        this.accountwisePaid = accountwisePaid;
        this.accountwiseBalance = accountwiseBalance;
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
            INSERT INTO dashboard(
                tenantId,
                totalReceive,
                totalPaid,
                balance,
                groupwiseReceive,
                groupwisePaid,
                groupwiseBalance,
                accountwiseReceive,
                accountwisePaid,
                accountwiseBalance,
                createdBy,
                createdOn,
                updatedOn
            )
            VALUES(
                '${this.tenantId}',
                '${this.totalReceive}',
                '${this.totalPaid}',
                '${this.balance}',
                '${this.groupwiseReceive}',
                '${this.groupwisePaid}',
                '${this.groupwiseBalance}',
                '${this.accountwiseReceive}',
                '${this.accountwisePaid}',
                '${this.accountwiseBalance}',
                '${this.createdBy}',
                '${this.dateandtime()}',
                '${this.dateandtime()}'
            )`;
            return db.execute(sql)

        } catch (error) {
            throw error;
        }
    };

    static findAll() {
        let sql = "SELECT * FROM dashboard";
        return db.execute(sql)
    }
    static findById(id) {
        let sql = `SELECT * FROM dashboard WHERE transaction_id = ${id}`;
        return db.execute(sql)
    }
    static delete(id) {
        let sql = `DELETE FROM dashboard WHERE transaction_id = ${id}`;
        return db.execute(sql)
    }

    async update(id) {
        let sql = `UPDATE dashboard SET tenantId='${this.tenantId}',totalReceive='${this.totalReceive}',totalPaid='${this.totalPaid}',balance='${this.balance}',groupwiseReceive='${this.groupwiseReceive}',groupwisePaid='${this.groupwisePaid}',groupwiseBalance='${this.groupwiseBalance}',accountwiseReceive='${this.accountwiseReceive}',accountwisePaid='${this.accountwisePaid}',accountwiseBalance='${this.accountwiseBalance}',updatedBy='${this.updatedBy}',updatedOn='${this.dateandtime()}' WHERE transaction_id = ${id}`;
        return db.execute(sql)

    };
}

module.exports = Dashboard;