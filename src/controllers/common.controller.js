const Common = require("../models/common");
const { createCommonSchema } = require('../validation/common.validation');
const { getDecodeToken } = require('../middlewares/decoded');

const CreateCommon = async (req, res) => {
    try {

        const { error } = createCommonSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        }

        let { tenantId, name, type, status, createdBy, updatedBy } = req.body;
        let common = new Common(tenantId, name, type, status, createdBy, updatedBy);

        common = await common.save()

        res.status(200).json({
            success: true,
            message: "Common create successfully!",
            record: { common }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        })
        console.log(error);
    }
}

const ListCommon = async (req, res, next) => {
    const token = getDecodeToken(req)
    try {
        const { q = '', id } = req.query;

        if (id) {
            const common = await Common.findById(id)
                ;

            if (common[0].length === 0) {
                return res.status(404).json({ success: false, message: 'Common not found' });
            }

            return res.status(200).json({ success: true, message: 'Common found', data: common[0][0] });
        }

        const commonResult = await Common.findAll(token.tenantId);
        let responseData = {
            success: true,
            message: 'Common List Successfully!',
            data: commonResult[0]
        };

        if (q) {
            const queryLowered = q.toLowerCase();
            const filteredData = commonResult[0].filter(
                common =>
                    common.name.toLowerCase().includes(queryLowered) ||
                    common.type.toLowerCase().includes(queryLowered) ||
                    (common.status.toLowerCase() === "active" && "active".includes(queryLowered))

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
                    message: 'No matching common found',
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

const getCommonById = async (req, res, next) => {
    try {
        let Id = req.params.id;
        let [common, _] = await Common.findById(Id)
            ;

        res.status(200).json({
            success: true,
            message: "Common Record Successfully!",
            data: common[0]
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

const deleteCommon = async (req, res, next) => {
    try {
        let Id = req.params.id;
        await Common.delete(Id)

        res.status(200).json({
            success: true,
            message: "Common Delete Successfully!"
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
}

const updateCommon = async (req, res, next) => {
    try {
        let { tenantId, name, type, status, createdBy, updatedBy } = req.body;
        let common = new Common(tenantId, name, type, status, createdBy, updatedBy)
        let Id = req.params.id;
        let [findcommon, _] = await Common.findById(Id)
            ;
        if (!findcommon) {
            throw new Error("Common not found!")
        }
        await common.update(Id)

        res.status(200).json({
            success: true,
            message: "Common Successfully Updated",
            record: { common }, returnOriginal: false, runValidators: true
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
}

module.exports = {
    CreateCommon,
    ListCommon,
    getCommonById,
    deleteCommon,
    updateCommon
}