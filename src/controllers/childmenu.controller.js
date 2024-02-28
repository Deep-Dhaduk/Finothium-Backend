const Childmenu = require('../models/childmenu');
const { createChildmenuSchema, updateChildmenuSchema } = require('../validation/childmenu.validation');
const { getDecodeToken } = require('../middlewares/decoded');

const CreateChildmenu = async (req, res) => {
    const token = getDecodeToken(req);

    try {
        const { error } = createChildmenuSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        }

        let { menu_name, parent_id, display_rank, status } = req.body;

        const tenantId = token.decodedToken.tenantId;
        const userId = token.decodedToken.userId;

        let childmenu = new Childmenu(tenantId, menu_name, parent_id, display_rank, status);

        childmenu.createdBy = userId;
        childmenu.updatedBy = userId;

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
    }
};

const ListChildmenu = async (req, res, next) => {
    const token = getDecodeToken(req)
    const tenantId = token.decodedToken.tenantId;
    try {
        const { q = '', id } = req.query;

        if (id) {
            const childmenu = await Childmenu.findById(id);

            if (childmenu[0].length === 0) {
                return res.status(404).json({ success: false, message: 'Childmenu not found' });
            }

            return res.status(200).json({ success: true, message: 'Childmenu found', data: childmenu[0][0] });
        }

        const childmenuResult = await Childmenu.findAll(tenantId);;
        let responseData = {
            success: true,
            message: 'Childmenu List Successfully!',
            data: childmenuResult[0]
        };

        responseData.data = responseData.data.map(childmenu => {
            const { tenantId, ...rest } = childmenu;
            return rest;
        })

        if (q) {
            const queryLowered = q.toLowerCase();
            const filteredData = childmenuResult[0].filter(
                childmenu =>
                    childmenu.menu_name.toLowerCase().includes(queryLowered) ||
                    (childmenu.parent_id && childmenu.parent_id.toString().includes(queryLowered)) ||
                    (typeof childmenu.status === 'string' && childmenu.status.toLowerCase() === "active" && "active".includes(queryLowered)) ||
                    (childmenu.display_rank && childmenu.display_rank.toString().includes(queryLowered))
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
                    message: 'No matching childmenu found',
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

const ActiveChildmenu = async (req, res, next) => {
    const token = getDecodeToken(req)
    const tenantId = token.decodedToken.tenantId;
    try {
        const { q = '', id } = req.query;

        if (id) {
            const childmenu = await Childmenu.findById(id);

            if (childmenu[0].length === 0) {
                return res.status(404).json({ success: false, message: 'Childmenu not found' });
            }

            return res.status(200).json({ success: true, message: 'Childmenu found', data: childmenu[0][0] });
        }

        const childmenuResult = await Childmenu.findActiveAll(tenantId);
        let responseData = {
            success: true,
            message: 'Childmenu List Successfully!',
            data: childmenuResult[0]
        };

        responseData.data = responseData.data.map(childmenu => {
            const { tenantId, ...rest } = childmenu;
            return rest;
        })

        if (q) {
            const queryLowered = q.toLowerCase();
            const filteredData = childmenuResult[0].filter(
                childmenu =>
                    childmenu.menu_name.toLowerCase().includes(queryLowered) ||
                    (typeof childmenu.status === 'string' && childmenu.status.toLowerCase() === "active" && "active".includes(queryLowered)) ||
                    (childmenu.display_rank && childmenu.display_rank.toString().includes(queryLowered))
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
                    message: 'No matching childmenu found',
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

const getChildmenuById = async (req, res, next) => {
    const token = getDecodeToken(req)
    const tenantId = token.decodedToken.tenantId;
    try {
        let Id = req.params.id;
        let [childmenu, _] = await Childmenu.findById(tenantId, Id);

        res.status(200).json({
            success: true,
            message: "Childmenu Record Successfully!",
            data: childmenu[0]
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

const deleteChildmenu = async (req, res, next) => {
    const token = getDecodeToken(req)
    const tenantId = token.decodedToken.tenantId;
    try {
        let Id = req.params.id;
        await Childmenu.delete(tenantId, Id)
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
    const token = getDecodeToken(req);
    const tenantId = token.decodedToken.tenantId;
    const userId = token.decodedToken.userId;
    try {

        const { error } = updateChildmenuSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        };

        let { menu_name, parent_id, display_rank, status } = req.body;

        let childmenu = new Childmenu(tenantId, menu_name, parent_id, display_rank, status)

        childmenu.updatedBy = userId;

        let Id = req.params.id;
        if (!Id) {
            return res.status(400).json({ success: false, message: "ID parameter is missing or invalid" });
        }

        let [findchildmenu, _] = await Childmenu.findById(tenantId, Id);
        if (!findchildmenu) {
            return res.status(404).json({ success: false, message: "Childmenu not found" });
        }

        await childmenu.update(tenantId, Id);
        res.status(200).json({
            success: true,
            message: "Childmenu Successfully Updated",
            record: { childmenu },
            returnOriginal: false,
            runValidators: true
        });

    } catch (error) {
        console.log(error);
        next(error)
    }
}

module.exports = {
    CreateChildmenu,
    ListChildmenu,
    ActiveChildmenu,
    getChildmenuById,
    deleteChildmenu,
    updateChildmenu
}