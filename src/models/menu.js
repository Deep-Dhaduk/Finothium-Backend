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
                        updatedOn='${this.dateandtime()}'
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

    static findAll(tenantId) {
        let sql = "SELECT * FROM menu_master";
        if (tenantId) {
            sql += ` WHERE tenantId = '${tenantId}'`;
        }
        return db.execute(sql)
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
        let sql = `UPDATE menu_master SET
                tenantId='${this.tenantId}',
                role_id='${this.role_id}',
                child_id='${this.child_id}',
                allow_access='${this.allow_access}',
                allow_add='${this.allow_add}',
                allow_edit='${this.allow_edit}',
                allow_delete='${this.allow_delete}',
                updatedBy='${this.updatedBy}',
                updatedOn='${this.dateandtime()}'
                WHERE id = ${id}`;
        return db.execute(sql);
    };
};

module.exports = Menu;