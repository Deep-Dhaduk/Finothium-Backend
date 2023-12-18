const db = require('../db/dbconnection')

class Tenant {
    constructor(tenantname, personname, address, contact, email, startdate, enddate, createdBy) {
        this.tenantname = tenantname;
        this.personname = personname;
        this.address = address;
        this.contact = contact;
        this.email = email;
        this.startdate = startdate;
        this.enddate = enddate;
        this.createdBy = createdBy;
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
        INSERT INTO tenant_master(
            tenantname,
            personname,
            address,
            contact,
            email,
            startdate,
            enddate,
            createdBy,
            createdOn,
            updatedOn
        )
        VALUES(
            '${this.tenantname}',
            '${this.personname}',
            '${this.address}',
            '${this.contact}',
            '${this.email}',
            '${this.startdate}',
            '${this.enddate}',
            '${this.createdBy}',
            '${this.dateandtime()}',
            '${this.dateandtime()}'
        )`;
            return db.execute(sql)

        } catch (error) {
            throw error;
        }
    }

    static findAll() {
        let sql = "SELECT * FROM tenant_master";
        return db.execute(sql)
    }
    static findById(id) {
        let sql = `SELECT * FROM tenant_master WHERE tenantId = ${id}`;
        return db.execute(sql)
    }
    static delete(id) {
        let sql = `DELETE FROM tenant_master WHERE tenantId = ${id}`;
        return db.execute(sql)
    }

    async update(id) {
        let sql = `UPDATE role_master SET tenantname='${this.tenantname}',personname='${this.personname}',address='${this.address}',contact='${this.contact}',email='${this.email}',startdate='${this.startdate}',enddate='${this.enddate}',createdBy='${this.createdBy}',updatedOn='${this.dateandtime()}' WHERE id = ${id}`;
        return db.execute(sql)

    };
}

module.exports = Tenant
