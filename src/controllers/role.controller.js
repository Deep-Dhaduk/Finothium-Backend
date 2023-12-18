const Role = require("../models/role");

const CreateRole = async (req, res) => {
    try {
        let { tenantId, rolename, status, createdBy } = req.body;
        let role = new Role(tenantId, rolename, status, createdBy);

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
        next(error)
    }
}

const ListRole = async (req, res, next) => {
    try {
        const role = await Role.findAll()
        res.status(200).json({
            success: true,
            message: "Role List Successfully!",
            data: { role }
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

const getRoleById = async (req, res, next) => {
    try {
        let Id = req.params.id;
        let [role, _] = await Role.findById(Id);

        res.status(200).json({
            success: true,
            message: "Role Record Successfully!",
            data: { role }
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
}

const updateRole = async (req, res, next) => {
    try {
        let { tenantId, rolename, status, createdBy } = req.body;
        let role = new Role(tenantId, rolename, status, createdBy)
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
}

module.exports = {
    CreateRole,
    ListRole,
    getRoleById,
    deleteRole,
    updateRole
}