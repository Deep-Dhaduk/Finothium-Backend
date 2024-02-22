const Parentmenu = require("../models/parentmenu");
const { createParentMenuSchema, updateParentMenuSchema } = require('../validation/parentmenu.validation');
const { getDecodeToken } = require('../middlewares/decoded');
const db = require('../db/dbconnection');
const message = ("This data is in used, you can't delete it.");

const CreateParentmenu = async (req, res) => {

    const token = getDecodeToken(req);
    try {
        const { error } = createParentMenuSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        };

        let { menu_name, display_rank, status, createdBy, updatedBy } = req.body;

        const tenantId = token.decodedToken.tenantId;

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
    }
};

const ListParentmenu = async (req, res, next) => {
    const token = getDecodeToken(req)
    try {
        const { q = '', id } = req.query;

        if (id) {
            const parentmenu = await Parentmenu.findById(id);

            if (parentmenu[0].length === 0) {
                return res.status(404).json({ success: false, message: 'Parentmenu not found' });
            }

            return res.status(200).json({ success: true, message: 'parentmenu found', data: parentmenu[0][0] });
        }

        const parentmenuResult = await Parentmenu.findAll(token.decodedToken.tenantId);;
        let responseData = {
            success: true,
            message: 'Parentmenu List Successfully!',
            data: parentmenuResult[0]
        };

        responseData.data = responseData.data.map(parentmenu => {
            const { tenantId, ...rest } = parentmenu;
            return rest;
        })

        if (q) {
            const queryLowered = q.toLowerCase();
            const filteredData = parentmenuResult[0].filter(
                parentmenu =>
                    parentmenu.menu_name.toLowerCase().includes(queryLowered) ||
                    (typeof parentmenu.status === 'string' && parentmenu.status.toLowerCase() === "active" && "active".includes(queryLowered))
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
                    message: 'No matching parentmenu found',
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

const ActiveParentmenu = async (req, res, next) => {
    const token = getDecodeToken(req)
    try {
        const { q = '', id } = req.query;

        if (id) {
            const parentmenu = await Parentmenu.findById(id);

            if (parentmenu[0].length === 0) {
                return res.status(404).json({ success: false, message: 'Parentmenu not found' });
            }

            return res.status(200).json({ success: true, message: 'parentmenu found', data: parentmenu[0][0] });
        }

        const parentmenuResult = await Parentmenu.findActiveAll(token.decodedToken.tenantId);
        let responseData = {
            success: true,
            message: 'Parentmenu List Successfully!',
            data: parentmenuResult[0]
        };

        responseData.data = responseData.data.map(parentmenu => {
            const { tenantId, ...rest } = parentmenu;
            return rest;
        })

        if (q) {
            const queryLowered = q.toLowerCase();
            const filteredData = parentmenuResult[0].filter(
                parentmenu =>
                    parentmenu.menu_name.toLowerCase().includes(queryLowered) ||
                    (typeof parentmenu.status === 'string' && parentmenu.status.toLowerCase() === "active" && "active".includes(queryLowered))
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
                    message: 'No matching parentmenu found',
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

const getParentmenuById = async (req, res, next) => {
    try {
        let Id = req.params.id;
        let [parentmenu, _] = await Parentmenu.findById(Id);

        res.status(200).json({
            success: true,
            message: "ParentMenu Record Successfully!",
            data: parentmenu[0]
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

const deleteParentmenu = async (req, res, next) => {
    try {
        let parentId = req.params.id;

        const [parentResults] = await db.execute(`SELECT COUNT(*) AS count FROM childmenu_master WHERE parent_id = ${parentId}`);

        if (parentResults[0].count > 0) {
            return res.status(200).json({ success: false, message: message });
        }

        await Parentmenu.delete(parentId);

        res.status(200).json({
            success: true,
            message: "Parent Delete Successfully!"
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const updateParentmenu = async (req, res, next) => {
    try {
        const token = getDecodeToken(req);

        const { error } = updateParentMenuSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        };

        let { menu_name, display_rank, status, createdBy, updatedBy } = req.body;

        const tenantId = token.decodedToken.tenantId;

        let parentmenu = new Parentmenu(tenantId, menu_name, display_rank, status, createdBy, updatedBy)
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
};

module.exports = {
    CreateParentmenu,
    ListParentmenu,
    ActiveParentmenu,
    getParentmenuById,
    deleteParentmenu,
    updateParentmenu
}