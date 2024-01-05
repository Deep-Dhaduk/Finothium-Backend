const Childmenu = require('../models/childmenu');
const { getDecodeToken } = require('../middlewares/decoded');

const CreateChildmenu = async (req, res) => {
    try {
        let { tenantId, menu_name, parent_id, display_rank, status, createdBy } = req.body;
        let childmenu = new Childmenu(tenantId, menu_name, parent_id, display_rank, status, createdBy);

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
}

const ListChildmenu = async (req, res, next) => {
    const token = getDecodeToken(req)
    try {
        const { q = '', id } = req.query;

        if (id) {
            const childmenu = await Childmenu.findById(id);

            if (childmenu[0].length === 0) {
                return res.status(404).json({ success: false, message: 'Childmenu not found' });
            }

            return res.status(200).json({ success: true, message: 'Childmenu found', data: childmenu[0][0] });
        }

        const childmenuResult = await Childmenu.findAll(token.tenantId);
        let responseData = {
            success: true,
            message: 'Childmenu List Successfully!',
            data: childmenuResult[0]
        };

        if (q) {
            const queryLowered = q.toLowerCase();
            const filteredData = childmenuResult[0].filter(
                childmenu =>
                    childmenu.menu_name.toLowerCase().includes(queryLowered) ||
                    childmenu.status.toLowerCase().includes(queryLowered)
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
    try {
        let Id = req.params.id;
        let [childmenu, _] = await Childmenu.findById(Id);

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
        let { tenantId, menu_name, parent_id, display_rank, status, updatedBy } = req.body;
        let childmenu = new Childmenu(tenantId, menu_name, parent_id, display_rank, status, updatedBy)
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