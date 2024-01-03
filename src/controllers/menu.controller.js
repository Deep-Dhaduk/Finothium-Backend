const Menu = require("../models/menu");

const CreateMenu = async (req, res, next) => {
    try {
        let { tenantId, role_id, parent_id, child_id, allow_access, allow_add, allow_edit, allow_delete, status, createdBy, updatedBy } = req.body;
        let menu = new Menu(tenantId, role_id, parent_id, child_id, allow_access, allow_add, allow_edit, allow_delete, status, createdBy, updatedBy);

        menu = await menu.save()

        res.status(200).json({
            success: true,
            message: "Menu create successfully!",
            record: { menu }
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

const ListMenu = async (req, res, next) => {
    try {
        const menu = await Menu.findAll()
        res.status(200).json({
            success: true,
            message: "Menu List Successfully!",
            data: menu[0]
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

const getMenuById = async (req, res, next) => {
    try {
        let Id = req.params.id;
        let [menu, _] = await Menu.findById(Id);

        res.status(200).json({
            success: true,
            message: "Menu Record Successfully!",
            data: menu[0]
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

const deleteMenu = async (req, res, next) => {
    try {
        let Id = req.params.id;
        await Menu.delete(Id)
        res.status(200).json({
            success: true,
            message: "Menu Delete Successfully!"
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
}

const updateMenu = async (req, res, next) => {
    try {
        let { tenantId, role_id, parent_id, child_id, allow_access, allow_add, allow_edit, allow_delete, status, createdBy, updatedBy } = req.body;
        let menu = new Menu(tenantId, role_id, parent_id, child_id, allow_access, allow_add, allow_edit, allow_delete, status, createdBy, updatedBy)
        let Id = req.params.id;
        let [findmenu, _] = await Menu.findById(Id);
        if (!findmenu) {
            throw new Error("Menu not found!")
        }
        await menu.update(Id)
        res.status(200).json({
            success: true,
            message: "Menu Successfully Updated",
            record: { menu }, returnOriginal: false, runValidators: true
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
}

module.exports = {
    CreateMenu,
    ListMenu,
    getMenuById,
    deleteMenu,
    updateMenu
}