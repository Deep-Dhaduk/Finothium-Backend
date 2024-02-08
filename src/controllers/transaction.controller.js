const Transaction = require("../models/transaction");
const { createTransactionSchema } = require('../validation/transaction.validation');
const { getDecodeToken } = require('../middlewares/decoded');

const CreateTransaction = async (req, res) => {
    const token = getDecodeToken(req);
    try {

        const { error } = createTransactionSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        };

        let { transaction_date, transaction_type, payment_type_Id, accountId, amount, description, createdBy, updatedBy, clientId } = req.body;

        const companyId = token.decodedToken.company.companyId;
        const tenantId = token.decodedToken.tenantId;

        let transaction = new Transaction(tenantId, transaction_date, transaction_type, payment_type_Id, accountId, amount, description, createdBy, updatedBy, '', clientId);

        transaction.companyId = companyId;

        transaction = await transaction.save()

        res.status(200).json({
            success: true,
            message: "Transaction create successfully!",
            record: { transaction }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        })
        console.log(error);
    }
};

const ListTransaction = async (req, res, next) => {
    const token = getDecodeToken(req)
    try {
        const { q = '', id } = req.query;
        const companyId = token.decodedToken.company.companyId;
        const { tenantId } = token.decodedToken;
        const { startDate, endDate, type, paymentTypeIds, clientTypeIds, accountTypeIds } = req.body

        if (id) {
            const transaction = await Transaction.findById(id);

            if (transaction[0].length === 0) {
                return res.status(404).json({ success: false, message: 'Transaction not found' });
            }

            return res.status(200).json({ success: true, message: 'Transaction found', data: transaction[0][0] });
        }

        let transaction;

        if (startDate && endDate && paymentTypeIds && clientTypeIds && accountTypeIds) {
            transaction = await Transaction.findAll(tenantId, companyId, startDate, endDate, type, paymentTypeIds, clientTypeIds, accountTypeIds);
        } else if (startDate && endDate) {
            transaction = await Transaction.findAll(tenantId, companyId, startDate, endDate, type, null, null, null);
        } else {
            transaction = await Transaction.findAll(tenantId, companyId, null, null, type, null, null, null);
        }
        let responseData = {
            success: true,
            message: 'Transaction List Successfully!',
            data: transaction[0]
        };

        if (q) {
            const queryLowered = q.toLowerCase();
            const filteredData = transactionResult[0].filter(transaction =>
                (transaction.transaction_type && transaction.transaction_type.toLowerCase().includes(queryLowered)) ||
                (transaction.payment_type_Id && transaction.payment_type_Id.toLowerCase().includes(queryLowered)) ||
                (transaction && transaction.toLowerCase().includes(queryLowered))
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
                    message: 'No matching Transaction found',
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

const getTransactionById = async (req, res, next) => {
    try {
        let Id = req.params.id;
        let [transaction, _] = await Transaction.findById(Id);

        res.status(200).json({
            success: true,
            message: "Transaction Record Successfully!",
            data: transaction[0]
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

const deleteTransaction = async (req, res, next) => {
    try {
        let Id = req.params.id;
        await Transaction.delete(Id)
        res.status(200).json({
            success: true,
            message: "Transaction Delete Successfully!"
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

const updateTransaction = async (req, res, next) => {
    const token = getDecodeToken(req);
    try {

        let { transaction_date, transaction_type, payment_type_Id, accountId, amount, description, createdBy, updatedBy, clientId } = req.body;

        const companyId = token.decodedToken.company.companyId;
        const tenantId = token.decodedToken.tenantId;

        let transaction = new Transaction(tenantId, transaction_date, transaction_type, payment_type_Id, accountId, amount, description, createdBy, updatedBy, companyId, clientId);
        let Id = req.params.id;
        let [findtransaction, _] = await Transaction.findById(Id);
        if (!findtransaction) {
            throw new Error("Transaction not found!")
        }
        await transaction.update(Id)
        res.status(200).json({
            success: true,
            message: "Transaction Successfully Updated",
            record: { transaction }, returnOriginal: false, runValidators: true
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

module.exports = {
    CreateTransaction,
    ListTransaction,
    getTransactionById,
    deleteTransaction,
    updateTransaction
}