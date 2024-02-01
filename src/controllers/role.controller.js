const Role = require("../models/role");
const { createRoleSchema } = require('../validation/role.validation');
const { getDecodeToken } = require('../middlewares/decoded');

const CreateRole = async (req, res) => {
    try {
        const token = getDecodeToken(req);

        const { error } = createRoleSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        };

        let { rolename, status, createdBy, updatedBy } = req.body;

        const tenantId = token.decodedToken.company.companyId;

        let role = new Role(tenantId, rolename, status, createdBy, updatedBy);

        role = await role.save()

        res.status(200).json({
            success: true,
            message: "Role create successfully!",
            record: { role }
        });
    } catch (error) {
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

        const roleResult = await Role.findAll(token.tenantId);
        let responseData = {
            success: true,
            message: 'Role List Successfully!',
            data: roleResult[0]
        };

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
        let Id = req.params.id;
        await Role.delete(Id)
        res.status(200).json({
            success: true,
            message: "Role Delete Successfully!"
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

const updateRole = async (req, res, next) => {
    try {
        const token = getDecodeToken(req);

        let { rolename, status, createdBy, updatedBy } = req.body;

        const tenantId = token.decodedToken.company.companyId;

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
    getRoleById,
    deleteRole,
    updateRole
}