const db = require('../db/dbconnection')

class Menu {
    constructor(tenantId, role_id, parent_id, child_id, allow_access, allow_add, allow_edit, allow_delete, status, createdBy, updatedBy) {
        this.tenantId = tenantId;
        this.role_id = role_id;
        this.parent_id = parent_id;
        this.child_id = child_id;
        this.allow_access = allow_access;
        this.allow_add = allow_add;
        this.allow_edit = allow_edit;
        this.allow_delete = allow_delete;
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
            INSERT INTO menu_master(
                tenantId,
                role_id,
                parent_id,
                child_id,
                allow_access,
                allow_add,
                allow_edit,
                allow_delete,
                status,
                createdBy,
                createdOn,
                updatedBy,
                updatedOn
            )
            VALUES(
                '${this.tenantId}',
                '${this.role_id}',
                '${this.parent_id}',
                '${this.child_id}',
                '${this.allow_access}',
                '${this.allow_add}',
                '${this.allow_edit}',
                '${this.allow_delete}',
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


    static findAll() {
        let sql = "SELECT * FROM menu_master";
        return db.execute(sql)
    }
    static findById(id) {
        let sql = `SELECT * FROM menu_master WHERE id = ${id}`;
        return db.execute(sql)
    }
    static delete(id) {
        let sql = `DELETE FROM menu_master WHERE id = ${id}`;
        return db.execute(sql)
    }

    async update(id) {
        let sql = `UPDATE menu_master SET
                tenantId='${this.tenantId}',
                role_id='${this.role_id}',
                parent_id='${this.parent_id}',
                child_id='${this.child_id}',
                allow_access='${this.allow_access}',
                allow_add='${this.allow_add}',
                allow_edit='${this.allow_edit}',
                allow_delete='${this.allow_delete}',
                status='${this.status}',
                updatedBy='${this.updatedBy}',
                updatedOn='${this.dateandtime()}'
                WHERE id = ${id}`;
        return db.execute(sql);
    }

};

module.exports = Menu;