const Payment = require("../models/payment");
const { getDecodeToken } = require('../middlewares/decoded');

const CreatePayment = async (req, res) => {
    try {
        let { tenantId, transaction_date, transaction_type, payment_type, client_category_name, accountId, amount, description, createdBy } = req.body;
        let payment = new Payment(tenantId, transaction_date, transaction_type, payment_type, client_category_name, accountId, amount, description, createdBy);

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
    const token = getDecodeToken(req)
    try {
        const { q = '', id } = req.query;

        if (id) {
            const payment = await Payment.findById(id);

            if (payment[0].length === 0) {
                return res.status(404).json({ success: false, message: 'Payment not found' });
            }

            return res.status(200).json({ success: true, message: 'Payment found', data: payment[0][0] });
        }

        const paymentResult = await Payment.findAll(token.tenantId);
        let responseData = {
            success: true,
            message: 'Payment List Successfully!',
            data: paymentResult[0]
        };

        if (q) {
            const queryLowered = q.toLowerCase();
            const filteredData = paymentResult[0].filter(
                payment =>
                    payment.transaction_type.toLowerCase().includes(queryLowered) ||
                    payment.payment_type.toLowerCase().includes(queryLowered) ||
                    payment.client_category_name.toLowerCase().includes(queryLowered)
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
                    message: 'No matching payment found',
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
        let { tenantId, transaction_date, transaction_type, payment_type, client_category_name, accountId, amount, description, updatedBy } = req.body;
        let payment = new Payment(tenantId, transaction_date, transaction_type, payment_type, client_category_name, accountId, amount, description, updatedBy)
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