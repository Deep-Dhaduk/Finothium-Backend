const db = require('../db/dbconnection');

class Parentmenu {
    constructor(tenantId, menu_name, display_rank, status, createdBy, updatedBy) {
        this.tenantId = tenantId;
        this.menu_name = menu_name;
        this.display_rank = display_rank;
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
            INSERT INTO parentmenu_master(
                tenantId,
                menu_name,
                display_rank,
                status,
                createdBy,
                createdOn,
                updatedBy,
                updatedOn
            )
            VALUES(
                '${this.tenantId}',
                '${this.menu_name}',
                '${this.display_rank}',
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

    static findAll(tenantId) {
        let sql = "SELECT *, DATE_SUB(createdOn, INTERVAL 5 HOUR) AS adjusted_createdOn, DATE_SUB(updatedOn, INTERVAL 5 HOUR) AS adjusted_updatedOn FROM parentmenu_master";
        if (tenantId) {
            sql += ` WHERE tenantId = '${tenantId}'`;
        }
        sql += " ORDER BY display_rank ASC";
        return db.execute(sql)
    };

    static findActiveAll(tenantId) {
        let sql = "SELECT *, DATE_SUB(createdOn, INTERVAL 5 HOUR) AS adjusted_createdOn, DATE_SUB(updatedOn, INTERVAL 5 HOUR) AS adjusted_updatedOn FROM parentmenu_master WHERE status = 1";
        if (tenantId) {
            sql += ` AND tenantId = '${tenantId}'`;
        }
        sql += " ORDER BY menu_name, display_rank ASC";
        return db.execute(sql)
    };

    static findById(id) {
        let sql = `SELECT * FROM parentmenu_master WHERE id = ${id}`;
        return db.execute(sql)
    };

    static delete(parentId) {
        let sql = `DELETE FROM parentmenu_master WHERE id = ${parentId}`;
        return db.execute(sql)
    };

    async update(id) {
        let sql = `UPDATE parentmenu_master SET tenantId='${this.tenantId}',menu_name='${this.menu_name}',display_rank='${this.display_rank}',status='${this.status}',createdBy='${this.createdBy}',updatedBy='${this.updatedBy}',updatedOn='${this.dateandtime()}' WHERE id = ${id}`;
        return db.execute(sql)

    };
}

module.exports = Parentmenu;