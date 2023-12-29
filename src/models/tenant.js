const db = require('../db/dbconnection')

class Tenant {
    constructor(tenantname, personname, address, contact, email, startdate, enddate, status, createdBy, updatedBy) {
        this.tenantname = tenantname;
        this.personname = personname;
        this.address = address;
        this.contact = contact;
        this.email = email;
        this.startdate = startdate;
        this.enddate = enddate;
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

            const formattedStartDate = this.formatDate(this.join_date);
            const formattedEndDate = this.formatDate(this.exit_date);

            let sql = `
        INSERT INTO tenant_master(
            tenantname,
            personname,
            address,
            contact,
            email,
            startdate,
            enddate,
            status,
            createdBy,
            createdOn,
            updatedBy,
            updatedOn
        )
        VALUES(
            '${this.tenantname}',
            '${this.personname}',
            '${this.address}',
            '${this.contact}',
            '${this.email}',
            '${formattedStartDate}',
            '${formattedEndDate}',
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
        let sql = `UPDATE role_master SET tenantname='${this.tenantname}',personname='${this.personname}',address='${this.address}',contact='${this.contact}',email='${this.email}',startdate='${this.startdate}',enddate='${this.enddate}',status='${this.status}',updatedBy='${this.updatedBy}',updatedOn='${this.dateandtime()}' WHERE tenantId = ${id}`;
        return db.execute(sql)

    };
}

module.exports = Tenant
