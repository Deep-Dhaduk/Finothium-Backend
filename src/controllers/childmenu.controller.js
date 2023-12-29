const Childmenu = require('../models/childmenu')

const CreateChildmenu = async (req, res) => {
    try {
        let { tenantId, menu_name, parent_id, display_rank, status, createdBy,updatedBy } = req.body;
        let childmenu = new Childmenu(tenantId, menu_name, parent_id, display_rank, status, createdBy,updatedBy);

        childmenu = await childmenu.save()

        res.status(200).json({
            success: true,
            message: "Childmenu create successfully!",
            record: { childmenu }
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

const ListChildmenu = async (req, res, next) => {
    try {
        const childmenu = await Childmenu.findAll()
        res.status(200).json({
            success: true,
            message: "Childmenu List Successfully!",
            data: { childmenu }
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

const getChildmenuById = async (req, res, next) => {
    try {
        let Id = req.params.id;
        let [childmenu, _] = await Childmenu.findById(Id);

        res.status(200).json({
            success: true,
            message: "Childmenu Record Successfully!",
            data: { childmenu }
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

const deleteChildmenu = async (req, res, next) => {
    try {
        let Id = req.params.id;
        await Childmenu.delete(Id)
        res.status(200).json({
            success: true,
            message: "Childmenu Delete Successfully!"
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
}

const updateChildmenu = async (req, res, next) => {
    try {
        let { tenantId, menu_name,parent_id, display_rank, status, updatedBy } = req.body;
        let childmenu = new Childmenu(tenantId, menu_name, parent_id,display_rank, status, updatedBy)
        let Id = req.params.id;
        let [findchildmenu, _] = await Childmenu.findById(Id);
        if (!findchildmenu) {
            throw new Error("childmenu not found!")
        }
        await childmenu.update(Id)
        res.status(200).json({
            success: true,
            message: "Childmenu Successfully Updated",
            record: { childmenu }, returnOriginal: false, runValidators: true
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
}

module.exports = {
    CreateChildmenu,
    ListChildmenu,
    getChildmenuById,
    deleteChildmenu,
    updateChildmenu
}