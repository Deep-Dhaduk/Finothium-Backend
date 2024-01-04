const Common = require("../models/common");

const CreateCommon = async (req, res) => {
    try {
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
        next(error)
    }
}

const ListCommon = async (req, res, next) => {
    try {
        const common = await Common.findAll()
        res.status(200).json({
            success: true,
            message: "Common List Successfully!",
            data: common[0]
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

const getCommonById = async (req, res, next) => {
    try {
        let Id = req.params.id;
        let [common, _] = await Common.findById(Id);

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
        let [findcommon, _] = await Common.findById(Id);
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