const db = require('../db/dbconnection')

class Common {
    constructor(tenantId, name, type, status, createdBy, updatedBy) {
        this.tenantId = tenantId;
        this.name = name;
        this.type = type;
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
            let sql = `
            INSERT INTO common_master(
                tenantId,
                name,
                type,
                status,
                createdBy,
                createdOn,
                updatedBy,
                updatedOn
            )
            VALUES(
                '${this.tenantId}',
                '${this.name}',
                '${this.type}',
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
    };

    static findAll(tenantId, type) {
        let sql = "SELECT *, DATE_SUB(createdOn, INTERVAL 5 HOUR) AS adjusted_createdOn, DATE_SUB(updatedOn, INTERVAL 5 HOUR) AS adjusted_updatedOn FROM common_master";
        if (tenantId) {
            sql += ` WHERE tenantId = '${tenantId}'`;
        }
        if (type) {
            if (tenantId) {
                sql += ` AND type = '${type}'`;
            } else {
                sql += ` WHERE type = '${type}'`;
            }
        }
        return db.execute(sql)
    };

    static findById(id) {
        let sql = `SELECT * FROM common_master WHERE common_id = ${id}`;
        return db.execute(sql)
    };

    static async delete(commonId) {
        try {
            const [accountResults] = await db.execute(`SELECT COUNT(*) AS count FROM account_master WHERE group_name_Id = ${commonId} OR account_type_Id = ${commonId}`);

            if (accountResults[0].count > 0) {
                return { success: false, message: 'Cannot delete common record. It is being used in the account_master table.' };
            }

            const [transactionResults] = await db.execute(`SELECT COUNT(*) AS count FROM transaction WHERE payment_type_id = ${commonId}`);

            if (transactionResults[0].count > 0) {
                return { success: false, message: 'Cannot delete common record. It is being used in the transaction table.' };
            }

            const [deleteResults] = await db.execute(`DELETE FROM common_master WHERE common_id = ${commonId}`);

            if (deleteResults.affectedRows > 0) {
                return { success: true, message: 'Common record deleted successfully.' };
            } else {
                return { success: false, message: 'Failed to delete common record.' };
            }
        } catch (error) {
            throw error;
        }
    }

    async update(id) {
        let sql = `UPDATE common_master SET tenantId='${this.tenantId}',name='${this.name}',type='${this.type}',status='${this.status}',createdBy='${this.createdBy}',updatedBy='${this.updatedBy}',updatedOn='${this.dateandtime()}' WHERE common_id = ${id}`;
        return db.execute(sql)

    };
}

module.exports = Common;