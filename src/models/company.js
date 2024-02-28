const db = require('../db/dbconnection')

class Company {
    constructor(tenantId, company_name, legal_name, authorize_person_name, address, contact_no, email, website, pan, gstin, status, createdBy, updatedBy) {
        this.tenantId = tenantId;
        this.company_name = company_name;
        this.legal_name = legal_name;
        this.authorize_person_name = authorize_person_name;
        this.address = address;
        this.contact_no = contact_no;
        this.email = email;
        this.website = website;
        this.pan = pan;
        this.gstin = gstin;
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
            INSERT INTO company_master(
                tenantId,
                company_name,
                legal_name,
                authorize_person_name,
                address,
                contact_no,
                email,
                website,
                pan,
                gstin,
                status,
                createdBy,
                createdOn,
                updatedBy,
                updatedOn
            )
            VALUES(
                '${this.tenantId}',
                '${this.company_name}',
                '${this.legal_name}',
                '${this.authorize_person_name}',
                '${this.address}',
                '${this.contact_no}',
                '${this.email}',
                '${this.website}',
                '${this.pan}',
                '${this.gstin} ',
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

    static findAllByUserId(tenantId, userId) {
        let sql = `
            SELECT c.*
            FROM company_master c
            INNER JOIN company_access ca ON c.id = ca.company_id
            WHERE c.tenantId = ${tenantId}
        `;

        if (userId) {
            sql += ` AND ca.user_id = ${userId}`;
        };
        sql += " ORDER BY c.company_name";
        return db.execute(sql);
    };

    static findAll(tenantId) {
        let sql = `
            SELECT c.*
            FROM company_master c
            WHERE c.tenantId = ${tenantId}
        `;
        sql += " ORDER BY c.company_name";
        return db.execute(sql);
    };

    static findActiveAllByUserId(tenantId, userId) {
        let sql = `
            SELECT c.*
            FROM company_master c
            INNER JOIN company_access ca ON c.id = ca.company_id
            WHERE status =1 AND c.tenantId = ${tenantId}
        `;

        if (userId) {
            sql += ` AND ca.user_id = ${userId}`;
        };
        sql += " ORDER BY c.company_name";
        return db.execute(sql);
    };

    static findActiveAll(tenantId) {
        let sql = `
            SELECT c.*
            FROM company_master c
            WHERE status =1 AND c.tenantId = ${tenantId}
            ORDER BY c.company_name
        `;
        return db.execute(sql);
    };

    static findByIdWithUserId(tenantId, id, userId) {
        let sql = `
            SELECT c.*
            FROM company_master c
            INNER JOIN company_access ca ON c.id = ca.company_id
            WHERE c.tenantId = ${tenantId}
        `;
        if (userId) {
            sql += ` AND ca.user_id = ${userId}`;
        };
        sql += `AND c.id=${id}`;
        return db.execute(sql)
    };

    static findById(tenantId, id) {
        let sql = `
            SELECT c.*
            FROM company_master c
            INNER JOIN company_access ca ON c.id = ca.company_id
            WHERE c.tenantId = ${tenantId}
            AND c.id=${id}
        `;
        return db.execute(sql)
    };

    static delete(tenantId, id) {
        let sql = `DELETE FROM company_master WHERE tenantId = ${tenantId} AND id = ${id}`;
        return db.execute(sql)
    };

    async update(tenantId, id) {
        let sql = `UPDATE company_master SET
                company_name='${this.company_name}',
                legal_name='${this.legal_name}',
                authorize_person_name='${this.authorize_person_name}',
                address='${this.address}',
                contact_no='${this.contact_no}',
                email='${this.email}',
                website='${this.website}',
                pan='${this.pan}',
                gstin='${this.gstin}',
                status='${this.status}',
                updatedBy='${this.updatedBy}',
                updatedOn='${this.dateandtime()}'
                WHERE tenantId = ${tenantId} AND id = ${id}`;
        return db.execute(sql);
    };

    static async exists(id) {
        let sql = `SELECT * FROM company_master WHERE id = ${id}`;
        const [result] = await db.execute(sql);
        return result.length > 0;
    };
};

module.exports = Company;