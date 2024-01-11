const db = require('../db/dbconnection')

class CompanyAccess {
    constructor(tenantId, user_id, company_id, createdBy, updatedBy) {
        this.tenantId = tenantId;
        this.user_id = user_id;
        this.company_id = company_id;
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
    };

    async save() {
        try {
            let insertionResults = [];

            for (const companyId of this.company_id) {
                const userExistsSql = `SELECT * FROM company_access WHERE user_id = '${this.user_id}' AND company_id = '${companyId}'`;
                const [userExistsResult] = await db.execute(userExistsSql);

                if (userExistsResult.length > 0) {
                    insertionResults.push({ message: `User with ID '${this.user_id}' and company ID '${companyId}' already exists.` });
                    continue;
                }

                const dataExistsSql = `SELECT * FROM company_master WHERE id = '${companyId}'`;
                const [dataExistsResult] = await db.execute(dataExistsSql);

                if (dataExistsResult.length === 0) {
                    insertionResults.push({ message: `No existing data for company ID '${companyId}' in company_master.` });
                    continue;
                }

                const chosenCompanyId = dataExistsResult[0].id;

                const chosenCompanyExistsSql = `SELECT * FROM company_access WHERE user_id = '${this.user_id}' AND company_id = '${chosenCompanyId}'`;
                const [chosenCompanyExistsResult] = await db.execute(chosenCompanyExistsSql);

                if (chosenCompanyExistsResult.length > 0) {
                    insertionResults.push({ message: `User with ID '${this.user_id}' already exists for chosen company ID '${chosenCompanyId}'.` });
                    continue;
                }

                let sql = `
                    INSERT INTO company_access(
                        tenantId,
                        user_id,
                        company_id,
                        createdBy,
                        createdOn,
                        updatedOn
                    )
                    VALUES(
                        '${this.tenantId}',
                        '${this.user_id}',
                        '${chosenCompanyId}',
                        '${this.createdBy}',
                        '${this.dateandtime()}',
                        '${this.dateandtime()}'
                    )`;

                const result = await db.execute(sql);
                insertionResults.push(result);
            }

            return insertionResults;
        } catch (error) {
            throw error;
        }
    };

    static findAll(tenantId) {
        let sql = "SELECT * FROM company_access";
        if (tenantId) {
            sql += ` WHERE tenantId = '${tenantId}'`;
        }
        return db.execute(sql)
    }
    static findById(id) {
        let sql = `SELECT * FROM company_access WHERE id = ${id}`;
        return db.execute(sql)
    }
    static delete(id) {
        let sql = `DELETE FROM company_access WHERE id = ${id}`;
        return db.execute(sql)
    }

    async update(id) {
        let sql = `UPDATE company_access SET tenantId='${this.tenantId}',user_id='${this.user_id}',company_id='${this.company_id}',updatedBy='${this.updatedBy}',updatedOn='${this.dateandtime()}' WHERE id = ${id}`;
        return db.execute(sql)

    };
}

module.exports = CompanyAccess;