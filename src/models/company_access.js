const db = require('../db/dbconnection');

class CompanyAccess {
    constructor(tenantId, user_id, companyId) {
        this.tenantId = tenantId;
        this.user_id = user_id;
        this.company_id = companyId;
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
                        createdOn,
                        updatedOn
                    )
                    VALUES(
                        '${this.tenantId}',
                        '${this.user_id}',
                        '${chosenCompanyId}',
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

    static findAllByCompanyAccess(userId) {
        let sql = "SELECT * FROM company_access";
        if (userId) {
            sql += ` WHERE user_id = '${userId}'`;
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
        try {
            // Check if user exists
            const userExistsSql = `SELECT * FROM user_master WHERE id = '${this.user_id}'`;
            const [userExistsResult] = await db.execute(userExistsSql);

            if (userExistsResult.length === 0) {
                throw new Error(`User with ID '${this.user_id}' not found.`);
            };

            for (const companyId of this.company_id) {
                const companyExistsSql = `SELECT * FROM company_master WHERE id = '${companyId}'`;
                const [companyExistsResult] = await db.execute(companyExistsSql);

                if (companyExistsResult.length === 0) {
                    throw new Error(`Company with ID '${companyId}' not found.`);
                }
            };

            const updateCompanySql = `
                UPDATE company_access
                SET tenantId='${this.tenantId}',
                    user_id='${this.user_id}',
                    updatedOn='${this.dateandtime()}'
                WHERE user_id = '${id}'`;

            await db.execute(updateCompanySql);

            return { message: 'CompanyAccess successfully updated.' };
        } catch (error) {
            throw error;
        }
    }

}

module.exports = CompanyAccess;