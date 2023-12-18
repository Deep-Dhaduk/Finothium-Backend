const db = require('../db/dbconnection')
const bcrypt = require('bcrypt');

class User {
    constructor(tenantId, username, fullname, email, password, confirmpassword, profile_image, company, status, resetpassword, roleId) {
        this.tenantId = tenantId;
        this.username = username;
        this.fullname = fullname;
        this.email = email;
        this.password = password;
        this.confirmpassword = confirmpassword;
        this.profile_image = profile_image
        this.company = company;
        this.status = status;
        this.resetpassword = resetpassword;
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
            // Check if the password and confirm password match
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
            company,
            status,
            resetpassword,
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
            '${this.profile_image}',
            '${this.company}',
            '${this.status}',
            '${this.resetpassword}',
            '${this.dateandtime()}',
            '${this.dateandtime()}',
            '${this.roleId}'
        )`;
            return db.execute(sql)

        } catch (error) {
            throw error;
        }
    }
    static comparePassword(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }

    static findAll() {
        let sql = "SELECT * FROM user_master";
        return db.execute(sql)
    }

    static findById(id) {
        let sql = `SELECT * FROM user_master WHERE id = ${id}`;
        return db.execute(sql)
    }
    static findOne() {
        let sql = `SELECT * FROM user_master WHERE id`;
        return db.execute(sql)
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
        let sql = `UPDATE user_master SET tenantId='${this.tenantId}',username='${this.username}',fullname='${this.fullname}',email='${this.email}',password='${this.password}',confirmpassword='${this.confirmpassword}',profile_image='${this.profile_image}',company='${this.company}',status='${this.status}',resetpassword='${this.resetpassword}',updatedOn='${this.dateandtime()}',roleId='${this.roleId}' WHERE id = ${id}`;
        return db.execute(sql)

    };
}
module.exports = User