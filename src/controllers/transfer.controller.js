const Transfer = require("../models/transfer");

const CreateTransfer = async (req, res, next) => {
    try {
        let { tenantId, transactionDate, paymentType, fromAccount, toAccount, amount, description, createdBy, updatedBy } = req.body;
        let transfer = new Transfer(tenantId, transactionDate, paymentType, fromAccount, toAccount, amount, description, createdBy, updatedBy);

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
        next(error)
    }
}

const ListTransfer = async (req, res, next) => {
    try {
        const transfer = await Transfer.findAll()
        res.status(200).json({
            success: true,
            message: "Transfer List Successfully!",
            data: transfer[0]
        });
    } catch (error) {
        console.log(error);
        next(error)
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
}

const updateTransfer = async (req, res, next) => {
    try {
        let { tenantId, transactionDate, paymentType, fromAccount, toAccount, amount, description, createdBy, updatedBy } = req.body;
        let transfer = new Transfer(tenantId, transactionDate, paymentType, fromAccount, toAccount, amount, description, createdBy, updatedBy)
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
}

module.exports = {
    CreateTransfer,
    ListTransfer,
    getTransferById,
    deleteTransfer,
    updateTransfer
}