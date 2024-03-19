// const TransactionDetails = require("../models/trasnaction_details");
// const { getDecodeToken } = require('../middlewares/decoded');

// // const CreateTransactionDetails = async (req, res) => {
// //     const token = getDecodeToken(req);
// //     try {

// //         let { name, amount, description } = req.body;

// //         const companyId = token.decodedToken.companyId;
// //         const tenantId = token.decodedToken.tenantId;
// //         const userId = token.decodedToken.userId;

// //         let transactionDetails = new TransactionDetails(tenantId, name, amount, description, '', '', '');

// //         transactionDetails.companyId = companyId;
// //         transactionDetails.createdBy = userId;
// //         transactionDetails.updatedBy = userId;

// //         transactionDetails = await transactionDetails.save()

// //         res.status(200).json({
// //             success: true,
// //             message: "TransactionDetails create successfully!",
// //             record: { transactionDetails }
// //         });
// //     } catch (error) {
// //         res.status(400).json({
// //             success: false,
// //             message: error.message,
// //         })
// //         console.log(error);
// //     }
// // };

// // const ListTransactionDetails = async (req, res, next) => {
// //     const token = getDecodeToken(req);
// //     const tenantId = token.decodedToken.tenantId;
// //     try {
// //         const { id } = req.query;

// //         if (id) {
// //             const transactionDetails = await TransactionDetails.findById(tenantId, id);

// //             if (transactionDetails[0].length === 0) {
// //                 return res.status(404).json({ success: false, message: 'TransactionDetails not found' });
// //             }

// //             return res.status(200).json({ success: true, message: 'TransactionDetails found', data: transactionDetails[0][0] });
// //         }

// //         const transactionDetailsResult = await TransactionDetails.findAll(tenantId);

// //         let responseData = {
// //             success: true,
// //             message: 'TransactionDetails List Successfully!',
// //             data: transactionDetailsResult[0]
// //         };
// //         res.status(200).json(responseData);

// //     } catch (error) {
// //         console.log(error);
// //         next(error);
// //     }
// // };


// module.exports = {
//     CreateTransactionDetails,
//     ListTransactionDetails
// }