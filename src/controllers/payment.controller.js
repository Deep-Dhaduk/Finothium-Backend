const Payment = require("../models/payment");

const CreatePayment = async (req, res) => {
    try {
        let { tenantId, transaction_date, transaction_type, payment_type, client_category_name, accountId, amount, description, createdBy, updatedBy } = req.body;
        let payment = new Payment(tenantId, transaction_date, transaction_type, payment_type, client_category_name, accountId, amount, description, createdBy, updatedBy);

        payment = await payment.save()

        res.status(200).json({
            success: true,
            message: "Payment create successfully!",
            record: { payment }
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

const ListPayment = async (req, res, next) => {
    try {
        const payment = await Payment.findAll()
        res.status(200).json({
            success: true,
            message: "Payment List Successfully!",
            data: payment[0]
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

const getPaymentById = async (req, res, next) => {
    try {
        let Id = req.params.id;
        let [payment, _] = await Payment.findById(Id);

        res.status(200).json({
            success: true,
            message: "Payment Record Successfully!",
            data: payment[0]
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

const deletePayment = async (req, res, next) => {
    try {
        let Id = req.params.id;
        await Payment.delete(Id)
        res.status(200).json({
            success: true,
            message: "Payment Delete Successfully!"
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
}

const updatePayment = async (req, res, next) => {
    try {
        let { tenantId, transaction_date, transaction_type, payment_type, client_category_name, accountId, amount, description, createdBy, updatedBy } = req.body;
        let payment = new Payment(tenantId, transaction_date, transaction_type, payment_type, client_category_name, accountId, amount, description, createdBy, updatedBy)
        let Id = req.params.id;
        let [findpayment, _] = await Payment.findById(Id);
        if (!findpayment) {
            throw new Error("Payment not found!")
        }
        await payment.update(Id)
        res.status(200).json({
            success: true,
            message: "Payment Successfully Updated",
            record: { payment }, returnOriginal: false, runValidators: true
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
}

module.exports = {
    CreatePayment,
    ListPayment,
    getPaymentById,
    deletePayment,
    updatePayment
}