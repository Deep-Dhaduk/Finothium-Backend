const Account = require("../models/account");
const { createAccountSchema } = require('../validation/account.validation');
const { getDecodeToken } = require('../middlewares/decoded');

const CreateAccount = async (req, res) => {
    try {

        const { error } = createAccountSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        }

        let { tenantId, account_name, group_name, join_date, exit_date, account_type, status, createdBy } = req.body;
        let { group_name_Id } = group_name;
        let { account_type_Id } = account_type;
        let account = new Account(tenantId, account_name, group_name_Id, join_date, exit_date, account_type_Id, status, createdBy);

        account = await account.save()

        res.status(200).json({
            success: true,
            message: "Account create successfully!",
            record: { account }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        })
        console.log(error);
    }
}

const ListAccount = async (req, res, next) => {
    const token = getDecodeToken(req)
    try {
        const { q = '', id } = req.query;

        if (id) {
            const account = await Account.findById(id);

            if (account[0].length === 0) {
                return res.status(404).json({ success: false, message: 'Account not found' });
            }

            return res.status(200).json({ success: true, message: 'Account found', data: account[0][0] });
        }

        const accountResult = await Account.findAll(token.tenantId);
        let responseData = {
            success: true,
            message: 'Account List Successfully!',
            data: accountResult[0]
        };

        if (q) {
            const queryLowered = q.toLowerCase();
            const filteredData = accountResult[0].filter(
                account =>
                    account.account_name.toLowerCase().includes(queryLowered) ||
                    account.group_name_Id.toLowerCase().includes(queryLowered) ||
                    account.account_type_Id.toLowerCase().includes(queryLowered) ||
                    (account.status.toLowerCase() === "active" && "active".includes(queryLowered))

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
                    message: 'No matching account found',
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

const getAccountById = async (req, res, next) => {
    try {
        let Id = req.params.id;
        let [account, _] = await Account.findById(Id);

        res.status(200).json({
            success: true,
            message: "Account Record Successfully!",
            data: account[0]
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

const deleteAccount = async (req, res, next) => {
    try {
        let Id = req.params.id;
        await Account.delete(Id)
        res.status(200).json({
            success: true,
            message: "Account Delete Successfully!"
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
}

const updateAccount = async (req, res, next) => {
    try {
        let { tenantId, account_name, group_name, join_date, exit_date, account_type, status, updatedBy } = req.body;
        let { group_name_Id } = group_name;
        let { account_type_Id } = account_type;

        let account = new Account(tenantId, account_name, group_name_Id, join_date, exit_date, account_type_Id, status, updatedBy);

        let Id = req.params.id;

        let [findaccount, _] = await Account.findById(Id);
        if (!findaccount) {
            throw new Error("Account not found!")
        }

        await account.update(Id)

        res.status(200).json({
            success: true,
            message: "Account Successfully Updated",
            record: { account }, returnOriginal: false, runValidators: true
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
}

module.exports = {
    CreateAccount,
    ListAccount,
    getAccountById,
    deleteAccount,
    updateAccount
}