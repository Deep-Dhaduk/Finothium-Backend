const Tenant = require("../models/tenant");
const { use } = require("../routes/company.route");
const { getDecodeToken } = require('../middlewares/decoded');
const { createTenantSchema, updateTenantSchema } = require('../validation/tenant.validation');
const db = require('../db/dbconnection');
const message = ("This data is in used, you can't delete it.");

let tenantResultSearch = (q, tenantResult) => {
    if (q) {
        const queryLowered = q.toLowerCase();
        return tenantResult.filter(tenant =>
            (tenant.tenantname.toLowerCase().includes(queryLowered)) ||
            (tenant.personname.toLowerCase().includes(queryLowered)) ||
            (tenant.address.toLowerCase().includes(queryLowered)) ||
            (typeof tenant.status === 'number' && tenant.status === 1 && "active".includes(queryLowered)) ||
            (typeof tenant.status === 'number' && tenant.status === 0 && "inactive".includes(queryLowered))
        );
    }
    else {
        return tenantResult
    }
};

const CreateTenant = async (req, res) => {
    const token = getDecodeToken(req);
    const userId = token.decodedToken.userId;

    try {
        const { error } = createTenantSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        };

        let { tenantname, personname, address, contact, email, startdate, enddate, status } = req.body;
        let tenant = new Tenant(tenantname, personname, address, contact, email, startdate, enddate, status);

        tenant.createdBy = userId;
        tenant.updatedBy = userId

        tenant = await tenant.save()

        res.status(200).json({
            success: true,
            message: "Tenant create successfully!",
            record: { tenant }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        })
        console.log(error);
    }
};

const ListTenant = async (req, res, next) => {
    try {
        const { q = '', id } = req.query;

        if (id) {
            const tenant = await Tenant.findById(id);

            if (tenant[0].length === 0) {
                return res.status(404).json({ success: false, message: 'Tenant not found' });
            }

            return res.status(200).json({ success: true, message: 'Tenant found', data: tenant[0][0] });
        }

        const tenantResult = await Tenant.findAll();

        tenantResult[0] = tenantResultSearch(q, tenantResult[0]);

        let responseData = {
            success: true,
            message: 'Tenant List Successfully!',
            data: tenantResult[0]
        };

        res.status(200).json(responseData);

    } catch (error) {
        console.log(error);
        next(error);
    }
};

const ActiveTenant = async (req, res, next) => {
    try {
        const { q = '', id } = req.query;

        if (id) {
            const tenant = await Tenant.findById(id);

            if (tenant[0].length === 0) {
                return res.status(404).json({ success: false, message: 'Tenant not found' });
            }

            return res.status(200).json({ success: true, message: 'Tenant found', data: tenant[0][0] });
        };

        const tenantResult = await Tenant.findActiveAll();

        tenantResult[0] = tenantResultSearch(q, tenantResult[0]);

        let responseData = {
            success: true,
            message: 'Tenant List Successfully!',
            data: tenantResult[0]
        };

        res.status(200).json(responseData);

    } catch (error) {
        console.log(error);
        next(error);
    }
};

const getTenantById = async (req, res, next) => {
    try {
        let Id = req.params.id;
        let [tenant, _] = await Tenant.findById(Id);

        res.status(200).json({
            success: true,
            message: "tenant Record Successfully!",
            data: tenant
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

// const deleteTenant = async (req, res, next) => {
//     try {
//         let tenantId = req.params.id;

//         const [companyAccessResults] = await db.execute(`SELECT COUNT(*) AS count FROM company_access WHERE tenantId = ${tenantId}`);

//         if (companyAccessResults[0].count > 0) {
//             return res.status(200).json({ success: false, message: message });
//         }

//         const [companySettingResults] = await db.execute(`SELECT COUNT(*) AS count FROM company_setting WHERE tenantId = ${tenantId}`);

//         if (companySettingResults[0].count > 0) {
//             return res.status(200).json({ success: false, message: message });
//         }

//         const [companyMasterResult] = await db.execute(`SELECT COUNT(*) AS count FROM company_master WHERE tenantId = ${tenantId}`);

//         if (companyMasterResult[0].count > 0) {
//             return res.status(200).json({ success: false, message: message });
//         }

//         const [childmenuMasterResult] = await db.execute(`SELECT COUNT(*) AS count FROM childmenu_master WHERE tenantId = ${tenantId}`);

//         if (childmenuMasterResult[0].count > 0) {
//             return res.status(200).json({ success: false, message: message });
//         }

//         const [parentmenuMasterResult] = await db.execute(`SELECT COUNT(*) AS count FROM parentmenu_master WHERE tenantId = ${tenantId}`);

//         if (parentmenuMasterResult[0].count > 0) {
//             return res.status(200).json({ success: false, message: message });
//         }

//         const [userMasterResult] = await db.execute(`SELECT COUNT(*) AS count FROM user_master WHERE tenantId = ${tenantId}`);

//         if (userMasterResult[0].count > 0) {
//             return res.status(200).json({ success: false, message: message });
//         }

//         const [roleMasterResult] = await db.execute(`SELECT COUNT(*) AS count FROM role_master WHERE tenantId = ${tenantId}`);

//         if (roleMasterResult[0].count > 0) {
//             return res.status(200).json({ success: false, message: message });
//         }

//         await Tenant.delete(tenantId)
//         res.status(200).json({
//             success: true,
//             message: "Tenant Delete Successfully!"
//         });
//     } catch (error) {
//         console.log(error);
//         next(error)
//     }
// };

const deleteTenant = async (req, res, next) => {
    try {
        let tenantId = req.params.id;

        // Call the stored procedure to delete the tenant
        await db.execute('CALL delete_tenant(?)', [tenantId]);

        res.status(200).json({
            success: true,
            message: "Tenant Deleted Successfully!"
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const updateTenant = async (req, res, next) => {
    const token = getDecodeToken(req);
    const userId = token.decodedToken.userId;
    try {

        const { error } = updateTenantSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        };

        let { tenantname, personname, address, contact, email, startdate, enddate, status } = req.body;
        let tenant = new Tenant(tenantname, personname, address, contact, email, startdate, enddate, status);

        tenant.updatedBy = userId

        let Id = req.params.id;
        let [findtenant, _] = await Tenant.findById(Id);
        if (!findtenant) {
            throw new Error("Tenant not found!")
        }
        await tenant.update(Id)
        res.status(200).json({
            success: true,
            message: "Tenant Successfully Updated",
            record: { tenant }, returnOriginal: false, runValidators: true
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

module.exports = {
    CreateTenant,
    ListTenant,
    ActiveTenant,
    getTenantById,
    deleteTenant,
    updateTenant
}