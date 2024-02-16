const Transfer = require("../models/transfer");
const { createTransferSchema, updateTransferSchema } = require('../validation/transfer.validation');
const { getDecodeToken } = require('../middlewares/decoded');

const CreateTransfer = async (req, res) => {
    const token = getDecodeToken(req)
    try {
        const { error } = createTransferSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        };

        let { transactionDate, paymentType_Id, fromAccount, toAccount, amount, description, createdBy, updatedBy } = req.body;

        const companyId = token.decodedToken.company.companyId;
        const tenantId = token.decodedToken.tenantId;

        let transfer = new Transfer(tenantId, transactionDate, paymentType_Id, fromAccount, toAccount, amount, description, createdBy, updatedBy);

        transfer.companyId = companyId;

        transfer = await transfer.save()

        res.status(200).json({
            success: true,
            message: "Transfer create successfully!",
            record: { transfer }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        })
        console.log(error);
    }
};

const ListTransfer = async (req, res, next) => {
    const tokenInfo = getDecodeToken(req);

    try {
        const { q = '', id } = req.query;
        const companyId = tokenInfo.decodedToken.company.companyId;
        const { tenantId } = tokenInfo.decodedToken;
        const { startDate, endDate, paymentTypeIds, accountTypeIds } = req.body;

        if (id) {
            const transfer = await Transfer.findById(id);

            if (transfer.length === 0) {
                return res.status(404).json({ success: false, message: 'Transfer not found' });
            }
            return res.status(200).json({ success: true, message: 'Transfer found', data: transfer[0] });
        }

        let transferResult;

        if (startDate && endDate) {
            transferResult = await Transfer.findAll(tenantId, companyId, startDate, endDate, paymentTypeIds, accountTypeIds);
        } else if (startDate && endDate && !paymentTypeIds && !accountTypeIds) {
            transferResult = await Transfer.findAll(tenantId, companyId, startDate, endDate, null, null);
        } else {
            transferResult = await Transfer.findAll(tenantId, companyId, null, null, null, null);
        }

        let responseData = {
            success: true,
            message: 'Transfer List Successfully!',
            data: transferResult[0]
        };

        if (q) {
            const queryLowered = q.toLowerCase();
            const filteredData = transferResult[0].filter(
                transfer =>
                    (transfer.paymentType_Id && typeof transfer.paymentType_Id === 'string' && transfer.paymentType_Id.toLowerCase().includes(queryLowered)) ||
                    (transfer.fromAccount && typeof transfer.fromAccount === 'string' && transfer.fromAccount.toLowerCase().includes(queryLowered)) ||
                    (transfer.toAccount && typeof transfer.toAccount === 'string' && transfer.toAccount.toLowerCase().includes(queryLowered))
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
                    message: 'No matching transfer found',
                    data: [],
                    total: 0
                };
            }
        }

        res.status(200).json(responseData);

    } catch (error) {
        console.error('Error in ListTransfer:', error);
        next(error);
    }
};

const getTransferById = async (req, res, next) => {
    try {
        let Id = req.params.id;
        let [transfer, _] = await Transfer.findById(Id);

        res.status(200).json({
            success: true,
            message: "Transfer Record Successfully!",
            data: { transfer }
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

const deleteTransfer = async (req, res, next) => {
    try {
        let Id = req.params.id;
        await Transfer.delete(Id)
        res.status(200).json({
            success: true,
            message: "Transfer Delete Successfully!"
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

const updateTransfer = async (req, res, next) => {
    const token = getDecodeToken(req)
    try {

        const { error } = updateTransferSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        };

        let { transactionDate, paymentType_Id, fromAccount, toAccount, amount, description, createdBy, updatedBy } = req.body;

        const companyId = token.decodedToken.company.companyId;
        const tenantId = token.decodedToken.tenantId;

        let transfer = new Transfer(tenantId, transactionDate, paymentType_Id, fromAccount, toAccount, amount, description, createdBy, updatedBy, companyId)
        let Id = req.params.id;
        let [findtransfer, _] = await Transfer.findById(Id);
        if (!findtransfer) {
            throw new Error("Transfer not found!")
        }
        await transfer.update(Id)
        res.status(200).json({
            success: true,
            message: "Transfer Successfully Updated",
            record: { transfer }, returnOriginal: false, runValidators: true
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

module.exports = {
    CreateTransfer,
    ListTransfer,
    getTransferById,
    deleteTransfer,
    updateTransfer
}