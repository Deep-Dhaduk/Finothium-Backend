const Account = require("../models/account");

const CreateAccount = async (req, res) => {
    try {
        let { tenantId, account_name, group_name, join_date, exit_date, account_type, status, createdBy, updatedBy } = req.body;
        let account = new Account(tenantId, account_name, group_name, join_date, exit_date, account_type, status, createdBy, updatedBy);

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
        next(error)
    }
}

const ListAccount = async (req, res, next) => {
    try {
        const account = await Account.findAll()
        res.status(200).json({
            success: true,
            message: "Account List Successfully!",
            data: account[0]
        });
    } catch (error) {
        console.log(error);
        next(error)
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
        let { tenantId, account_name, group_name, join_date, exit_date, account_type, status, createdBy, updatedBy } = req.body;
        let account = new Account(tenantId, account_name, group_name, join_date, exit_date, account_type, status, createdBy, updatedBy)
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