const db = require('../db/dbconnection');
const bcrypt = require('bcrypt');
class User {
    constructor(tenantId, username, fullname, email, password, confirmpassword, profile_image_filename, companyId, status, createdBy, updatedBy, roleId) {
        this.tenantId = tenantId;
        this.username = username;
        this.fullname = fullname;
        this.email = email;
        this.password = password;
        this.confirmpassword = confirmpassword;
        this.profile_image_filename = profile_image_filename;
        this.companyId = companyId;
        this.status = status;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.roleId = roleId;
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
            if (this.password !== this.confirmpassword) {
                throw new Error("Password and Confirm Password do not match");
            }
            const hashedPassword = await bcrypt.hash(this.password, 8);

            let sql = `
            INSERT INTO user_master(
                tenantId,
                username,
                fullname,
                email,
                password,
                confirmpassword,
                profile_image_filename,
                status,
                createdBy,
                createdOn,
                updatedOn,
                roleId
            )
            VALUES(
                '${this.tenantId}',
                '${this.username}',
                '${this.fullname}',
                '${this.email}',
                '${hashedPassword}',
                '${hashedPassword}',
                '${this.profile_image_filename}',
                '${this.status}',
                '${this.createdBy}',
                '${this.dateandtime()}',
                '${this.dateandtime()}',
                '${this.roleId}'
            )`;
            const tmp = await db.execute(sql);
            return tmp;

        } catch (error) {
            throw error;
        }
    }
    static comparePassword(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }

    static findAll(tenantId) {
        let sql = `
            SELECT u.*,
                   r.roleName,
                   GROUP_CONCAT(c.company_name) AS companyNames,
                   DATE_SUB(u.createdOn, INTERVAL 5 HOUR) AS adjusted_createdOn,
                   DATE_SUB(u.updatedOn, INTERVAL 5 HOUR) AS adjusted_updatedOn
            FROM user_master u
            LEFT JOIN role_master r ON u.roleId = r.id
            LEFT JOIN company_access ca ON u.id = ca.user_id
            LEFT JOIN company_master c ON ca.company_id = c.id
        `;
        if (tenantId) {
            sql += ` WHERE u.tenantId = '${tenantId}'`;
        }
        sql += 'GROUP BY u.id';
        sql += " ORDER BY fullname ASC";
        return db.execute(sql);
    }

    static findActiveAll(tenantId) {
        let sql = `
            SELECT u.*,
                   r.roleName,
                   GROUP_CONCAT(c.company_name) AS companyNames,
                   DATE_SUB(u.createdOn, INTERVAL 5 HOUR) AS adjusted_createdOn,
                   DATE_SUB(u.updatedOn, INTERVAL 5 HOUR) AS adjusted_updatedOn
            FROM user_master u
            LEFT JOIN role_master r ON u.roleId = r.id
            LEFT JOIN company_access ca ON u.id = ca.user_id
            LEFT JOIN company_master c ON ca.company_id = c.id
        `;
        if (tenantId) {
            sql += ` WHERE u.tenantId = '${tenantId}'AND status = 1`;
        } else {
            sql += " WHERE status = 1";
        }
        sql += 'GROUP BY u.id';
        sql += " ORDER BY fullname ASC";
        return db.execute(sql);
    }

    static findById(id) {
        let sql = `SELECT * FROM user_master WHERE id = ${id}`;
        return db.execute(sql)
    }

    static findOne(userId) {
        let sql = `
            SELECT u.*,
                   r.roleName,
                   GROUP_CONCAT(c.id) AS companyIds,
                   GROUP_CONCAT(c.company_name) AS companyNames
            FROM user_master u
            LEFT JOIN role_master r ON u.roleId = r.id
            LEFT JOIN company_access ca ON u.id = ca.user_id
            LEFT JOIN company_master c ON ca.company_id = c.id
            WHERE u.id = ${userId}
            GROUP BY u.id
        `;
        return db.execute(sql);
    }

    static findByEmail(email) {
        let sql = `SELECT * FROM user_master WHERE email = '${email}'`;
        return db.execute(sql);
    }

    static delete(id) {
        let sql = `DELETE FROM user_master WHERE id = ${id}`;
        return db.execute(sql)
    }

    async update(id, profile_image_filename) {
        try {
            if (profile_image_filename) {
                this.profile_image_filename = profile_image_filename;
            }

            let profileImageQueryPart = '';
            if (this.profile_image_filename) {
                profileImageQueryPart = `, profile_image_filename='${this.profile_image_filename}'`;
            } else {
                profileImageQueryPart = `, profile_image_filename=null`;
            }

            let sql = `
                UPDATE user_master
                SET tenantId='${this.tenantId}',
                    username='${this.username}',
                    fullname='${this.fullname}',
                    email='${this.email}',
                    password='${this.password}',
                    confirmpassword='${this.password}',
                    status='${this.status}',
                    createdBy='${this.createdBy}',
                    updatedBy='${this.updatedBy}',
                    updatedOn='${this.dateandtime()}',
                    roleId='${this.roleId}'
                    ${profileImageQueryPart}
                WHERE id = ${id}`;

            await db.execute(sql);

            if (this.companyId && Array.isArray(this.companyId) && this.companyId.length > 0) {
                const existingCompaniesSql = `SELECT company_id FROM company_access WHERE user_id = '${id}'`;
                const [existingCompaniesResult] = await db.execute(existingCompaniesSql);
                const existingCompanyIds = existingCompaniesResult.map(item => item.company_id);

                for (const companyId of existingCompanyIds) {
                    const updateCompanySql = `
                        UPDATE company_access
                        SET tenantId='${this.tenantId}',
                            user_id='${id}',
                            updatedOn='${this.dateandtime()}'
                        WHERE user_id = '${id}' AND company_id = '${companyId}'`;

                    await db.execute(updateCompanySql);
                };

                const newCompanies = this.companyId.filter(companyId => !existingCompanyIds.includes(companyId));
                for (const newCompanyId of newCompanies) {
                    const addCompanySql = `
                        INSERT INTO company_access(tenantId, user_id, company_id, createdOn, updatedOn)
                        VALUES('${this.tenantId}', '${id}', '${newCompanyId}', '${this.dateandtime()}', '${this.dateandtime()}')`;
                    await db.execute(addCompanySql);
                }

                const removedCompanies = existingCompanyIds.filter(companyId => !this.companyId.includes(companyId));
                for (const removedCompanyId of removedCompanies) {
                    const removeCompanySql = `DELETE FROM company_access WHERE user_id = '${id}' AND company_id = '${removedCompanyId}'`;
                    await db.execute(removeCompanySql);
                }
            }

            return { message: 'User and associated company access successfully updated.' };
        } catch (error) {
            throw error;
        }
    }

    static saveOTP(email, otp) {
        try {
            let sql = `
        UPDATE user_master
        SET otp = '${otp}'
        WHERE email = '${email}'`;

            return db.execute(sql);
        } catch (error) {
            throw error;
        }
    }

    static findOTP(email) {
        let sql = `SELECT otp FROM user_master WHERE email = '${email}'`;
        return db.execute(sql);
    }

    static updatePassword(email, hashedPassword) {
        let sql = `UPDATE user_master SET password='${hashedPassword}', confirmpassword='${hashedPassword}'WHERE email = '${email}'`;
        return db.execute(sql);
    };
};
module.exports = User