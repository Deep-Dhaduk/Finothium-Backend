const Parentmenu = require("../models/parentmenu");

const CreateParentmenu = async (req, res) => {
    try {
        let { tenantId, menu_name, display_rank, status, createdBy, updatedBy } = req.body;
        let parentmenu = new Parentmenu(tenantId, menu_name, display_rank, status, createdBy, updatedBy);

        parentmenu = await parentmenu.save()

        res.status(200).json({
            success: true,
            message: "ParentMenu create successfully!",
            record: { parentmenu }
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

const ListParentmenu = async (req, res, next) => {
    try {
        const parentmenu = await Parentmenu.findAll()
        res.status(200).json({
            success: true,
            message: "ParentMenu List Successfully!",
            data: { parentmenu }
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

const getParentmenuById = async (req, res, next) => {
    try {
        let Id = req.params.id;
        let [parentmenu, _] = await Parentmenu.findById(Id);

        res.status(200).json({
            success: true,
            message: "ParentMenu Record Successfully!",
            data: { parentmenu }
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

const deleteParentmenu = async (req, res, next) => {
    try {
        let Id = req.params.id;
        await Parentmenu.delete(Id)
        res.status(200).json({
            success: true,
            message: "ParentMenu Delete Successfully!"
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
}

const updateParentmenu = async (req, res, next) => {
    try {
        let { tenantId, menu_name, display_rank, status, updatedBy } = req.body;
        let parentmenu = new Parentmenu(tenantId, menu_name, display_rank, status, updatedBy)
        let Id = req.params.id;
        let [findparentmenu, _] = await Parentmenu.findById(Id);
        if (!findparentmenu) {
            throw new Error("ParentMenu not found!")
        }
        await parentmenu.update(Id)
        res.status(200).json({
            success: true,
            message: "ParentMenu Successfully Updated",
            record: { parentmenu }, returnOriginal: false, runValidators: true
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
}

module.exports = {
    CreateParentmenu,
    ListParentmenu,
    getParentmenuById,
    deleteParentmenu,
    updateParentmenu
}