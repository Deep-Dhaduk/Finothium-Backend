const db = require('../db/dbconnection')

class Menu {
    constructor(tenantId, role_id, menuItems, createdBy, updatedBy) {
        this.tenantId = tenantId;
        this.role_id = role_id;
        this.menuItems = menuItems;
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
            for (const item of this.menuItems) {
                const existingMenu = await this.findByChildId(item.child_id);

                if (existingMenu) {
                    let sql = `
                            UPDATE menu_master SET
                            tenantId='${this.tenantId}',
                            role_id='${this.role_id}',
                            allow_access='${item.allow_access}',
                            allow_add='${item.allow_add}',
                            allow_edit='${item.allow_edit}',
                            allow_delete='${item.allow_delete}',
                            createdBy='${this.createdBy}',
                            updatedOn='${this.dateandtime()}',
                            updatedBy='${this.updatedBy}'
                            WHERE child_id = '${item.child_id}'`;
                    await db.execute(sql);
                } else {
                    let sql = `
                        INSERT INTO menu_master(
                            tenantId,
                            role_id,
                            child_id,
                            allow_access,
                            allow_add,
                            allow_edit,
                            allow_delete,
                            createdBy,
                            createdOn,
                            updatedBy,
                            updatedOn
                        )
                        VALUES (
                            '${this.tenantId}',
                            '${this.role_id}',
                            '${item.child_id}',
                            '${item.allow_access}',
                            '${item.allow_add}',
                            '${item.allow_edit}',
                            '${item.allow_delete}',
                            '${this.createdBy}',
                            '${this.dateandtime()}',
                            '${this.updatedBy}',
                            '${this.dateandtime()}'
                        )`;

                    await db.execute(sql);
                }
            }

            return { success: true };
        } catch (error) {
            throw error;
        }
    }

    async findByChildId(childId) {
        let sql = `SELECT * FROM menu_master WHERE child_id = '${childId}'`;
        const result = await db.execute(sql);
        return result[0][0];
    }

    static findAll(tenantId, roleId) {
        let sql = `
            SELECT m.*,
                   c.menu_name AS child_menu_name,
                   c.parent_id,
                   p.menu_name AS parent_menu_name,
                   DATE_SUB(c.createdOn, INTERVAL 5 HOUR) AS adjusted_createdOn,
                   DATE_SUB(c.updatedOn, INTERVAL 5 HOUR) AS adjusted_updatedOn
            FROM menu_master m
            LEFT JOIN childmenu_master c ON m.child_id = c.id
            LEFT JOIN parentmenu_master p ON c.parent_id = p.id
            WHERE m.role_id = ?`;
            if (tenantId) {
                sql += ` WHERE m.tenantId = '${tenantId}'`;
            };
        return db.execute(sql, [roleId]);
    };

    static findById(id) {
        let sql = `SELECT * FROM menu_master WHERE id = ${id}`;
        return db.execute(sql)
    };

    static delete(id) {
        let sql = `DELETE FROM menu_master WHERE id = ${id}`;
        return db.execute(sql)
    };

    async update(id) {
        try {
            let sql = `
                UPDATE menu_master SET
                tenantId=?,
                role_id=?,
                child_id=?,
                allow_access=?,
                allow_add=?,
                allow_edit=?,
                allow_delete=?,
                createdBy=?,
                updatedBy=?,
                updatedOn=?
                WHERE id = ?`

            let values = [
                this.tenantId,
                this.role_id,
                this.child_id,
                this.allow_access,
                this.allow_add,
                this.allow_edit,
                this.allow_delete,
                this.createdBy,
                this.updatedBy,
                this.dateandtime(),
                id
            ];

            await db.execute(sql, values);
        } catch (error) {
            throw error;
        }
    }

};

module.exports = Menu;