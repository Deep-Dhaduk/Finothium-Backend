const db = require('../db/dbconnection')

class Childmenu {
    constructor(tenantId, menu_name, parent_id, display_rank, status, createdBy, updatedBy) {
        this.tenantId = tenantId;
        this.menu_name = menu_name;
        this.parent_id = parent_id;
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
            INSERT INTO childmenu_master(
                tenantId,
                menu_name,
                parent_id,
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
                '${this.parent_id}',
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
        let sql = `
            SELECT c.*,
                   p.menu_name as parent_menu_name,
                   p.display_rank as parent_display_rank,
                   DATE_SUB(c.createdOn, INTERVAL 5 HOUR) AS adjusted_createdOn,
                   DATE_SUB(c.updatedOn, INTERVAL 5 HOUR) AS adjusted_updatedOn
            FROM childmenu_master c
            LEFT JOIN parentmenu_master p ON c.parent_id = p.id
        `;
        if (tenantId) {
            sql += ` WHERE c.tenantId = '${tenantId}'`;
        }
        sql += " ORDER BY parent_display_rank, display_rank ASC";
        return db.execute(sql);
    };

    static findActiveAll(tenantId) {
        let sql = `
        SELECT c.*,
        p.menu_name as parent_menu_name,
        p.display_rank as parent_display_rank,
        DATE_SUB(c.createdOn, INTERVAL 5 HOUR) AS adjusted_createdOn,
        DATE_SUB(c.updatedOn, INTERVAL 5 HOUR) AS adjusted_updatedOn
        FROM childmenu_master c
        LEFT JOIN parentmenu_master p ON c.parent_id = p.id
        WHERE c.status = 1
        `;
        if (tenantId) {
            sql += ` AND c.tenantId = '${tenantId}'`;
        }
        sql += " ORDER BY parent_display_rank, display_rank ASC";
        return db.execute(sql);
    };

    static findById(id) {
        let sql = `SELECT * FROM childmenu_master WHERE id = ${id}`;
        return db.execute(sql)
    };

    static delete(id) {
        let sql = `DELETE FROM childmenu_master WHERE id = ${id}`;
        return db.execute(sql)
    };

    async update(id) {
        let sql = `UPDATE childmenu_master SET tenantId='${this.tenantId}',menu_name='${this.menu_name}',parent_id='${this.parent_id}',display_rank='${this.display_rank}',status='${this.status}', createdBy='${this.createdBy}',updatedBy='${this.updatedBy}',updatedOn='${this.dateandtime()}' WHERE id = ${id}`;
        return db.execute(sql)

    };
}

module.exports = Childmenu;