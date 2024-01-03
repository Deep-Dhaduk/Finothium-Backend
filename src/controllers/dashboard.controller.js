const Dashboard = require("../models/dashboard");

const CreateDashboard = async (req, res, next) => {
    try {
        let { tenantId, totalReceive, totalPaid, balance, groupwiseReceive, groupwisePaid, groupwiseBalance,accountwiseReceive,accountwisePaid,accountwiseBalance, createdBy, updatedBy } = req.body;
        let dashboard = new Dashboard(tenantId, totalReceive, totalPaid, balance, groupwiseReceive, groupwisePaid, groupwiseBalance,accountwiseReceive,accountwisePaid,accountwiseBalance, createdBy, updatedBy);

        dashboard = await dashboard.save()

        res.status(200).json({
            success: true,
            message: "Dashboard create successfully!",
            record: { dashboard }
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

const ListDashboard = async (req, res, next) => {
    try {
        const dashboard = await Dashboard.findAll()
        res.status(200).json({
            success: true,
            message: "Dashboard List Successfully!",
            data: dashboard[0]
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

const getDashboardById = async (req, res, next) => {
    try {
        let Id = req.params.id;
        let [dashboard, _] = await Dashboard.findById(Id);

        res.status(200).json({
            success: true,
            message: "Dashboard Record Successfully!",
            data: { dashboard }
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

const deleteDashboard = async (req, res, next) => {
    try {
        let Id = req.params.id;
        await Dashboard.delete(Id)
        res.status(200).json({
            success: true,
            message: "Dashboard Delete Successfully!"
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
}

const updateDashboard = async (req, res, next) => {
    try {
        let { tenantId, totalReceive, totalPaid, balance, groupwiseReceive, groupwisePaid, groupwiseBalance,accountwiseReceive,accountwisePaid,accountwiseBalance, createdBy, updatedBy
         } = req.body;
        let dashboard = new Dashboard(tenantId, totalReceive, totalPaid, balance, groupwiseReceive, groupwisePaid, groupwiseBalance,accountwiseReceive,accountwisePaid,accountwiseBalance, createdBy, updatedBy
            )
        let Id = req.params.id;
        let [finddashboard, _] = await Dashboard.findById(Id);
        if (!finddashboard) {
            throw new Error("Dashboard not found!")
        }
        await dashboard.update(Id)
        res.status(200).json({
            success: true,
            message: "Dashboard Successfully Updated",
            record: { dashboard }, returnOriginal: false, runValidators: true
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
}

module.exports = {
    CreateDashboard,
    ListDashboard,
    getDashboardById,
    deleteDashboard,
    updateDashboard
}