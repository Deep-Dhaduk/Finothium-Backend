const Menu = require("../models/menu");
const { createMenuSchema } = require('../validation/menu.validation');
const { getDecodeToken } = require('../middlewares/decoded');

const CreateMenu = async (req, res) => {
    try {
        const { error } = createMenuSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        }

        const { tenantId, role_id, menuItems, createdBy, updatedBy } = req.body;
        const menu = new Menu(tenantId, role_id, menuItems, createdBy, updatedBy);

        const result = await menu.save();

        res.status(200).json({
            success: true,
            message: result.success ? "Menu items saved successfully!" : "Menu items updated successfully!",
            record: { menu }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
        console.log(error);
    }
};


const ListMenu = async (req, res, next) => {
    const token = getDecodeToken(req)
    try {
        const { q = '', id } = req.query;

        if (id) {
            const menu = await Menu.findById(id);

            if (menu[0].length === 0) {
                return res.status(404).json({ success: false, message: 'Menu not found' });
            }

            return res.status(200).json({ success: true, message: 'Menu found', data: menu[0][0] });
        }

        const menuResult = await Menu.findAll(token.tenantId);
        let responseData = {
            success: true,
            message: 'Menu List Successfully!',
            data: menuResult[0]
        };

        if (q) {
            const queryLowered = q.toLowerCase();
            const filteredData = menuResult[0].filter(
                menu =>
                    (menu.status.toLowerCase() === "active" && "active".includes(queryLowered))
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
                    message: 'No matching menu found',
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
        let { tenantId, role_id, menuItems, updatedBy } = req.body;
        let menu = new Menu(tenantId, role_id, menuItems, updatedBy)
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