const Tenant = require("../models/tenant");

const CreateTenant = async (req, res) => {
    try {
        let { tenantname, personname, address, contact, email, startdate, enddate, createdB } = req.body;
        let tenant = new Tenant(tenantname, personname, address, contact, email, startdate, enddate, createdB);

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
        next(error)
    }
}

const ListTenant = async (req, res, next) => {
    try {
        const tenant = await Tenant.findAll()
        res.status(200).json({
            success: true,
            message: "Tenant List Successfully!",
            data: { tenant }
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

const getTenantById = async (req, res, next) => {
    try {
        let Id = req.params.id;
        let [tenant, _] = await Tenant.findById(Id);

        res.status(200).json({
            success: true,
            message: "tenant Record Successfully!",
            data: { tenant }
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
        let { tenantname, personname, address, contact, email, startdate, enddate, created } = req.body;
        let tenant = new Tenant(tenantname, personname, address, contact, email, startdate, enddate, created)
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