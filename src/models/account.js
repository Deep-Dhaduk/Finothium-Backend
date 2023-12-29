const db = require('../db/dbconnection')

class Account {
    constructor(tenantId, account_name, group_name, join_date, exit_date, account_type, status, createdBy, updatedBy) {
        this.tenantId = tenantId;
        this.account_name = account_name;
        this.group_name = group_name;
        this.join_date = join_date;
        this.exit_date = exit_date;
        this.account_type = account_type;
        this.status = status;
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

            const formattedJoinDate = this.formatDate(this.join_date);
            const formattedExitDate = this.formatDate(this.exit_date);

            let sql = `
            INSERT INTO account_master(
                tenantId,
                account_name,
                group_name,
                join_date,
                exit_date,
                account_type,
                status,
                createdBy,
                createdOn,
                updatedBy,
                updatedOn
            )
            VALUES(
                '${this.tenantId}',
                '${this.account_name}',
                '${this.group_name}',
                '${formattedJoinDate}',
                '${formattedExitDate}',
                '${this.account_type}',
                '${this.status}',
                '${this.createdBy}',
                '${this.dateandtime()}',
                '${this.updatedBy}',
                '${this.dateandtime()}'
            )`;
            return db.execute(sql)

        } catch (error) {
            throw error;
        }
    }

    formatDate(dateString) {
        const [dd, mm, yyyy] = dateString.split('-');
        return `${yyyy}-${mm}-${dd}`;
    }

    static findAll() {
        let sql = "SELECT * FROM account_master";
        return db.execute(sql)
    }
    static findById(id) {
        let sql = `SELECT * FROM account_master WHERE account_id = ${id}`;
        return db.execute(sql)
    }
    static delete(id) {
        let sql = `DELETE FROM account_master WHERE account_id = ${id}`;
        return db.execute(sql)
    }

    async update(id) {
        let sql = `UPDATE account_master SET tenantId='${this.tenantId}',account_name='${this.account_name}',group_name='${this.group_name}',join_date='${this.join_date}',exit_date='${this.exit_date}',account_type='${this.account_type}',status='${this.status}',updatedBy='${this.updatedBy}',updatedOn='${this.dateandtime()}' WHERE account_id = ${id}`;
        return db.execute(sql)

    };
}

module.exports = Account;