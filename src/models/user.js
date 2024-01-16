const db = require('../db/dbconnection');
const bcrypt = require('bcrypt');

class User {
    constructor(tenantId, username, fullname, email, password, confirmpassword, profile_image, companyIds, status, createdBy, updatedBy,roleId) {
        this.tenantId = tenantId;
        this.username = username;
        this.fullname = fullname;
        this.email = email;
        this.password = password;
        this.confirmpassword = confirmpassword;
        this.profile_image = profile_image
        this.companyIds = companyIds;
        this.status = status;
        this.createdBy = createdBy
        this.updatedBy = updatedBy
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
                profile_image,
                status,
                createdBy,
                createdOn,
                updatedBy,
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
                '${this.profile_image}',
                '${this.status}',
                '${this.createdBy}',
                '${this.dateandtime()}',
                '${this.updatedBy}',
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
        let sql = "SELECT * FROM user_master";
        if (tenantId) {
            sql += ` WHERE tenantId = '${tenantId}'`;
        }
        return db.execute(sql)
    }

    static findById(id) {
        let sql = `SELECT * FROM user_master WHERE id = ${id}`;
        return db.execute(sql)
    }

    static findOne(userId) {
        let sql = `SELECT * FROM user_master WHERE id = ${userId}`;
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

    async update(id) {
        const hashedPassword = await bcrypt.hash(this.password, 8);

        const companyIdArray = Array.isArray(this.companyIds) ? this.companyIds : [this.companyIds];

        const companyIdString = companyIdArray.join(',');

        let sql = `UPDATE user_master SET tenantId='${this.tenantId}',username='${this.username}',fullname='${this.fullname}',email='${this.email}',password='${hashedPassword}',confirmpassword='${hashedPassword}',profile_image='${this.profile_image}',companyId='${companyIdString}',status='${this.status}',createdBy='${this.createdBy}',updatedBy='${this.updatedBy}',updatedOn='${this.dateandtime()}',roleId='${this.roleId}' WHERE id = ${id}`;
        return db.execute(sql);
    };

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
    }


}
module.exports = User