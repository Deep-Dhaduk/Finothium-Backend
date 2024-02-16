const Account = require("../models/account");
const { createAccountSchema, updateAccountSchema } = require('../validation/account.validation');
const { getDecodeToken } = require('../middlewares/decoded');
const db = require('../db/dbconnection');

const CreateAccount = async (req, res) => {
    const token = getDecodeToken(req);

    try {
        const { error } = createAccountSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        }

        const { account_name, group_name_Id, join_date, exit_date, account_type_Id, status, createdBy, updatedBy } = req.body;

        const companyId = token.decodedToken.company.companyId;
        const tenantId = token.decodedToken.tenantId;

        let account = new Account(tenantId, account_name, group_name_Id, join_date, exit_date, account_type_Id, status, createdBy, updatedBy);

        account.companyId = companyId;

        account = await account.save();

        res.status(200).json({
            success: true,
            message: "Account created successfully!",
            record: { account }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
        console.log(error);
    }
};

const ListAccount = async (req, res, next) => {
    const token = getDecodeToken(req);
    const companyId = token.decodedToken.company.companyId
    try {
        const { q = '', id } = req.query;

        if (id) {
            const account = await Account.findById(id);

            if (account[0].length === 0) {
                return res.status(404).json({ success: false, message: 'Account not found' });
            }

            return res.status(200).json({ success: true, message: 'Account found', data: account[0][0] });
        }

        const accountResult = await Account.findAll(token.tenantId, companyId);

        let responseData = {
            success: true,
            message: 'Account List Successfully!',
            data: accountResult[0]
        };

        responseData.data = responseData.data.map(account => {
            const { tenantId, ...rest } = account;
            return rest;
        })

        if (q) {
            const queryLowered = q.toLowerCase();
            const filteredData = accountResult[0].filter(account =>
                (account.account_name && account.account_name.toLowerCase().includes(queryLowered)) ||
                (account.group_name && account.group_name.toLowerCase().includes(queryLowered)) ||
                (account.account_type_name && account.account_type_name.toLowerCase().includes(queryLowered)) ||
                (typeof account.status === 'string' && account.status.toLowerCase() === "active" && "active".includes(queryLowered))
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
                    message: 'No matching menu found',
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

const ActiveAccount = async (req, res, next) => {
    const token = getDecodeToken(req);
    const companyId = token.decodedToken.company.companyId
    try {
        const { q = '', id } = req.query;

        if (id) {
            const account = await Account.findById(id);

            if (account[0].length === 0) {
                return res.status(404).json({ success: false, message: 'Account not found' });
            }

            return res.status(200).json({ success: true, message: 'Account found', data: account[0][0] });
        }

        const accountResult = await Account.findActiveAll(token.tenantId, companyId);

        let responseData = {
            success: true,
            message: 'Account List Successfully!',
            data: accountResult[0]
        };

        responseData.data = responseData.data.map(account => {
            const { tenantId, ...rest } = account;
            return rest;
        })

        if (q) {
            const queryLowered = q.toLowerCase();
            const filteredData = accountResult[0].filter(account =>
                (account.account_name && account.account_name.toLowerCase().includes(queryLowered)) ||
                (account.group_name && account.group_name.toLowerCase().includes(queryLowered)) ||
                (account.account_type_name && account.account_type_name.toLowerCase().includes(queryLowered)) ||
                (typeof account.status === 'string' && account.status.toLowerCase() === "active" && "active".includes(queryLowered))
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
                    message: 'No matching menu found',
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
        let accountId = req.params.id;

        const [accountResults] = await db.execute(`SELECT COUNT(*) AS count FROM transaction WHERE accountId = ${accountId}`);

        if (accountResults[0].count > 0) {
            return res.status(200).json({ success: false, message: "Data already in use, cannot be modified." });
        }

        const [fromAccountResults] = await db.execute(`SELECT COUNT(*) AS count FROM transfer WHERE fromAccount = ${accountId}`);

        if (fromAccountResults[0].count > 0) {
            return res.status(200).json({ success: false, message: "Data already in use, cannot be modified." });
        }

        const [toAccountResults] = await db.execute(`SELECT COUNT(*) AS count FROM transfer WHERE toAccount = ${accountId}`);

        if (toAccountResults[0].count > 0) {
            return res.status(200).json({ success: false, message: "Data already in use, cannot be modified." });
        }
        await Account.delete(accountId);

        res.status(200).json({
            success: true,
            message: "Account Delete Successfully!"
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const updateAccount = async (req, res, next) => {
    try {
        const token = getDecodeToken(req);

        const { error } = updateAccountSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        };

        let { account_name, group_name_Id, join_date, exit_date, account_type_Id, status, createdBy, updatedBy } = req.body;

        const tenantId = token.decodedToken.tenantId;

        let account = new Account(tenantId, account_name, group_name_Id, join_date, exit_date, account_type_Id, status, createdBy, updatedBy);

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
    ActiveAccount,
    getAccountById,
    deleteAccount,
    updateAccount
}