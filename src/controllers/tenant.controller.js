const Tenant = require("../models/tenant");
const { createTenantSchema } = require('../validation/tenant.validation');

const CreateTenant = async (req, res) => {
    try {

        const { error } = createTenantSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        };

        let { tenantname, personname, address, contact, email, startdate, enddate, status, createdBy,updatedBy } = req.body;
        let tenant = new Tenant(tenantname, personname, address, contact, email, startdate, enddate, status, createdBy,updatedBy);

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
}

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
        let responseData = {
            success: true,
            message: 'Tenant List Successfully!',
            data: tenantResult[0]
        };

        if (q) {
            const queryLowered = q.toLowerCase();
            const filteredData = tenantResult[0].filter(
                tenant =>
                    tenant.tenantname.toLowerCase().includes(queryLowered) ||
                    tenant.personname.toLowerCase().includes(queryLowered) ||
                    tenant.address.toLowerCase().includes(queryLowered) ||
                    (tenant.status.toLowerCase() === "active" && "active".includes(queryLowered))
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
                    message: 'No matching tenant found',
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

const getTenantById = async (req, res, next) => {
    try {
        let Id = req.params.id;
        let [tenant, _] = await Tenant.findById(Id);

        res.status(200).json({
            success: true,
            message: "tenant Record Successfully!",
            data: tenant[0]
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

const deleteTenant = async (req, res, next) => {
    try {
        let Id = req.params.id;
        await Tenant.delete(Id)
        res.status(200).json({
            success: true,
            message: "Tenant Delete Successfully!"
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
}

const updateTenant = async (req, res, next) => {
    try {
        let { tenantname, personname, address, contact, email, startdate, enddate, status, createdBy, updatedBy } = req.body;
        let tenant = new Tenant(tenantname, personname, address, contact, email, startdate, enddate, status, createdBy, updatedBy)
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
}



module.exports = {
    CreateTenant,
    ListTenant,
    getTenantById,
    deleteTenant,
    updateTenant
}