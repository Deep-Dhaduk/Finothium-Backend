const Role = require("../models/role");
const { createRoleSchema, updateRoleSchema } = require('../validation/role.validation');
const { getDecodeToken } = require('../middlewares/decoded');
const db = require('../db/dbconnection');
const message = ("This data is in used, you can't delete it.");

const CreateRole = async (req, res) => {
    const token = getDecodeToken(req);
    try {

        const { error } = createRoleSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        };

        let { rolename, status, createdBy, updatedBy } = req.body;

        const tenantId = token.decodedToken.tenantId;

        let role = new Role(tenantId, rolename, status, createdBy, updatedBy);

        role = await role.save()

        res.status(200).json({
            success: true,
            message: "Role create successfully!",
            record: { role }
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY' && error.sqlMessage.includes('rolename')) {
            return res.status(200).json({
                success: false,
                message: "Entry with provided role already exists"
            });
        }
        res.status(400).json({
            success: false,
            message: error.message,
        })
        console.log(error);
    }
};

const ListRole = async (req, res, next) => {
    const token = getDecodeToken(req)
    try {
        const { q = '', id } = req.query;

        if (id) {
            const role = await Role.findById(id);

            if (role[0].length === 0) {
                return res.status(404).json({ success: false, message: 'Role not found' });
            }

            return res.status(200).json({ success: true, message: 'Role found', data: role[0][0] });
        }

        const roleResult = await Role.findAll(token.decodedToken.tenantId);;
        let responseData = {
            success: true,
            message: 'Role List Successfully!',
            data: roleResult[0]
        };

        responseData.data = responseData.data.map(role => {
            const { tenantId, ...rest } = role;
            return rest;
        });

        if (q) {
            const queryLowered = q.toLowerCase();
            const filteredData = roleResult[0].filter(
                role =>
                    role.rolename.toLowerCase().includes(queryLowered) ||
                    (typeof role.status === 'string' && role.status.toLowerCase() === "active" && "active".includes(queryLowered))
            );

            if (filteredData.length > 0) {
                responseData = {
                    ...responseData,
                    data: filteredData,
                    total: filteredData.length
                };
            } else {
                responseData = {
                    ...responseData,
                    message: 'No matching role found',
                    data: [],
                    total: 0
                };
            }
        }

        res.status(200).json(responseData);

    } catch (error) {
        console.log(error);
        next(error);
    }
};

const ActiveRole = async (req, res, next) => {
    const token = getDecodeToken(req)
    try {
        const { q = '', id } = req.query;

        if (id) {
            const role = await Role.findById(id);

            if (role[0].length === 0) {
                return res.status(404).json({ success: false, message: 'Role not found' });
            }

            return res.status(200).json({ success: true, message: 'Role found', data: role[0][0] });
        }

        const roleResult = await Role.findActiveAll(token.decodedToken.tenantId);
        let responseData = {
            success: true,
            message: 'Role List Successfully!',
            data: roleResult[0]
        };

        responseData.data = responseData.data.map(role => {
            const { tenantId, ...rest } = role;
            return rest;
        });

        if (q) {
            const queryLowered = q.toLowerCase();
            const filteredData = roleResult[0].filter(
                role =>
                    role.rolename.toLowerCase().includes(queryLowered) ||
                    (typeof role.status === 'string' && role.status.toLowerCase() === "active" && "active".includes(queryLowered))
            );

            if (filteredData.length > 0) {
                responseData = {
                    ...responseData,
                    data: filteredData,
                    total: filteredData.length
                };
            } else {
                responseData = {
                    ...responseData,
                    message: 'No matching role found',
                    data: [],
                    total: 0
                };
            }
        }

        res.status(200).json(responseData);

    } catch (error) {
        console.log(error);
        next(error);
    }
};

const getRoleById = async (req, res, next) => {
    try {
        let Id = req.params.id;
        let [role, _] = await Role.findById(Id);

        res.status(200).json({
            success: true,
            message: "Role Record Successfully!",
            data: role[0]
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

const deleteRole = async (req, res, next) => {
    try {
        let roleId = req.params.id;

        const [roleResults] = await db.execute(`SELECT COUNT(*) AS count FROM user_master WHERE roleId = ${roleId}`);

        if (roleResults[0].count > 0) {
            return res.status(200).json({ success: false, message: message });
        }

        await Role.delete(roleId);

        res.status(200).json({
            success: true,
            message: "Role Delete Successfully!"
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const updateRole = async (req, res, next) => {
    const token = getDecodeToken(req);
    try {

        const { error } = updateRoleSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        };

        let { rolename, status, createdBy, updatedBy } = req.body;

        const tenantId = token.decodedToken.tenantId;

        let role = new Role(tenantId, rolename, status, createdBy, updatedBy)
        let Id = req.params.id;
        let [findrole, _] = await Role.findById(Id);
        if (!findrole) {
            throw new Error("Role not found!")
        }
        await role.update(Id)
        res.status(200).json({
            success: true,
            message: "Role Successfully Updated",
            record: { role }, returnOriginal: false, runValidators: true
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

module.exports = {
    CreateRole,
    ListRole,
    ActiveRole,
    getRoleById,
    deleteRole,
    updateRole
}